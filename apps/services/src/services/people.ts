import { EPeopleType, IFaceImage, IPeople } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb'
import { FaceImageModel, PeopleModel, TagPeopleModel } from '@betaschool-reborn/database-model/models/index'
import axios from 'axios'

const EPSILON = 0.9

export async function updateWithDatabase (co, type: EPeopleType) {
  const people = new PeopleModel({fullname: co.fullname, type: [type]})
  if (co.full_name) people.fullname = co.full_name
  if (co.id) people.code = co.id
  // people.code = co.code
  if (co.user_name) people.username = co.user_name
  if (co.dob) people.dob = co.dob
  if (co.primary_center_name) people.center = co.primary_center_name
  if (co.email_address) people.email = co.email_address
  if (co.phone_mobile) people.phone = co.phone_mobile
  if (!people.type.includes(type)) people.type.push(type)
  if (co.address) people.address = co.address || ''
  await people.save()
}


export const linkPeopleToDotB = async (req, res, next) => {
  const { email, username } = req.body
  try {
    const person = await PeopleModel.findOne({email: email, username: username})
    
    if (person) {
      res.json({
        code: 200,
        data: person
      })
      return
    }

    console.log('không tìm thấy ', email, username, 'fetch từ dotb')

    const response = await axios({
      method: 'post',
      url: `https://beta.dotb.cloud/rest/v11_3/v1/search_object`,
      headers: { 
        'Content-Type': 'application/json', 
        'content-language': 'vi', 
        'device-type': '0'
      },
      data: {
        access_token: process.env.dotBtoken, // eslint-disable-line
        keyword: username
      }
    })
    const data = response.data.data.find(d => { return d.email_address.trim().toLowerCase() === email.trim().toLowerCase() && d.user_name === username.trim().toLowerCase() })
    if(!data) {
      res.json({
        code: 404,
        error: 'Không tìm thấy username và email khớp với danh sách nhân viên trong DotB'
      })
      return
    }
    
    // check if email exist in database:
    const personEmailCheck = await PeopleModel.findOne({$or: [{email: email}, {username: username}]})
    if (personEmailCheck) {
      if(!data) {
        res.json({
          code: 404,
          error: 'username hoặc email đã được sử dụng bởi một người khác, vui lòng thay đổi email trong dotb sau đó thay đổi trong User Management rồi liên kết lại'
        })
        return
      }
    }

    await updateWithDatabase(data, EPeopleType.staff)
    const person1 = await PeopleModel.findOne({email: email, username: username})
    
    if (person1) {
      res.json({
        code: 200,
        data: person1
      })
      return
    }
    res.json({
      code: 404,
      error: 'Không tìm thấy username và email khớp với danh sách nhân viên trong DotB, không tạo được nhân viên'
    })
    return
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const searchAPeople = async (req, res, next) => {
  const { people } = req.body

  try {
    const personCursor = PeopleModel.find({}).populate('tags').cursor()

    const arr = []
    for (let doc = await personCursor.next(); doc != null; doc = await personCursor.next()) {
      const score = scorePeopleData(people, doc)
      if (score > 0) arr.push({doc: doc.toObject(), score})
    }
    res.json({
      code: 200,
      data: arr.sort((a,b) => b.score-a.score).slice(0, 5).map(v => v.doc)
    })

  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const fetchAPeople = async (req, res, next) => {
  const { _id } = req.body

  try {
    const person = await PeopleModel.findOne({_id: new ObjectId(_id)}).populate('tags father mother students')
    if (!person) {
      res.json({
        code: 404,
        error: 'Không tìm thấy người trong cơ sở dữ liệu'
      })
      return
    }

    const tag = await TagPeopleModel.findOne({people: person})
    let images = []
    if (tag) { images = await FaceImageModel.find({tags: tag}).sort([['time', 'descending']]).limit(10)}
    res.json({
      code: 200,
      person: person.toObject(),
      tag: (tag ? tag.toObject() : null),
      images: images.map(v => v.toObject())
    })

  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const fetchATag = async (req, res, next) => {
  const { _id } = req.body
  const tag = await TagPeopleModel.findOne({_id: new ObjectId(_id)})
  if (!tag) {
    res.json({
      code: 404,
      error: 'Không tìm thấy người trong cơ sở dữ liệu'
    })
    return
  }
  let images = []
  images = await FaceImageModel.find({tags: tag}).sort([['time', 'descending']]).limit(10)
    res.json({
      code: 200,
      tag: tag.toObject(),
      images: images.map(v => v.toObject())
  })
}

export const deleteTag = async (req, res, next) => {
  const { _id } = req.body
  try {
    const tag = await TagPeopleModel.findOne({_id: new ObjectId(_id)})

    if (!tag) {
      res.json({
        code: 404,
        error: 'Không tìm thấy tag'
      })
    }

    const imgCursor = FaceImageModel.find({tags: tag}).cursor()

    for (let doc = await imgCursor.next(); doc != null; doc = await imgCursor.next()) {
      doc.tags = null
      if (doc.otherTags.length > 0) {
        doc.tags = doc.otherTags[0]
        doc.otherTags.shift()
      }
      await doc.updateOne(doc)
    }

    await tag.deleteOne()

    res.json({
      code: 200
    })
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const searchParent = async (req, res, next) => {
  const { _id } = req.body

  try {
    const person = await PeopleModel.findOne({_id: new ObjectId(_id)}).populate('father').populate('mother')

    const arr = []

    if (!person) {
      res.json({
        code: 200,
        data: []
      })
      return
    }

    if (person.father) arr.push(person.father)
    if (person.mother) arr.push(person.mother)
    
    res.json({
      code: 200,
      data: arr
    })

  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}


function scorePeopleData (people: IPeople, record: IPeople) {
  let score = 0
  // fullname
  if (people.fullname && record.fullname.trim().toUpperCase().includes(people.fullname.trim().toUpperCase())) {
    score += 2
  }
  // phone
  if (people.phone.trim() && record.phone.trim() === people.phone.trim()) {
    score += 2
  }
  // code
  if (people.code && people.code.trim().toUpperCase() === record.code.trim().toUpperCase()) {
    score += 20
  }

  // dob
  if (people.dob && people.dob.trim() === record.dob.trim()) {
    score += 2
  }

  return score
}


export const newTag = async (req, res, next) => {
  const {people}: {people: IPeople & { _id: string }} = req.body
  const {imageList}: {imageList: Array<IFaceImage & { _id: string }>} = req.body

  let tagPeople

  try {

    if (people._id) {
      const peopleObject = await PeopleModel.findOne({_id: new ObjectId(people._id)})
      tagPeople = await TagPeopleModel.findOne({ people: peopleObject})
      // Tag was exist
      if (tagPeople) {
        tagPeople.faceImages.push(...imageList)
        await tagPeople.updateOne(tagPeople)
      } else {
        tagPeople = new TagPeopleModel({
          fullname: peopleObject.fullname,
          dob: peopleObject.dob,
          code: peopleObject.code,
          type: peopleObject.type,
          phone: peopleObject.phone,
          people: peopleObject,
          faceImages: imageList,
          taggedBy: req.user._id
        })
        await tagPeople.save()
      }
    } else {
      tagPeople = new TagPeopleModel({
        fullname: people.fullname,
        dob: people.dob,
        code: people.code,
        type: people.type,
        phone: people.phone,
        people: null,
        faceImages: imageList,
        taggedBy: req.user._id
      })
      await tagPeople.save()
    }
    const faceImage = FaceImageModel.find({tags: null}).cursor()
    for (let doc = await faceImage.next(); doc != null; doc = await faceImage.next()) {
      for (const {vec} of tagPeople.faceImages) {
        const score = distance(doc.vec, vec)
        if (score<=EPSILON) {
          doc.tags = tagPeople
          await doc.updateOne(doc)
        }
      }
    }
    res.json({
      code: 200,
      data: 'Đã cập nhật cơ sở dữ liệu'
    })

  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }

  // Retag database
}


function distance (p: Array<number>, q: Array<number>): number {
  let sum = 0;
  let i = Math.min(p.length, q.length);
  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }
  return Math.sqrt(sum);
}
