import { VTProblemModel } from '@betaschool-reborn/database-model'
export const getListVTProblem = async (req, res) => {
  const { page, perPage} = req.body
  if (page=== undefined || perPage === undefined ){
    res.send({
      code: 405,
      error: 'Wrong request, 1536'
    })
    return
  }
  try {
    const count = await VTProblemModel.countDocuments({})

    const result = await VTProblemModel.find({})
    .populate({path: 'editor'})
    .populate({path: 'approvedBy'})
    .populate({path: 'activeOrDeBy'})
    .skip(perPage * page)
    .limit(perPage)

    if (result.values) {
      res.send({
        code: 200,
        data: result.values,
        pagination: {
          count: count
        }
      })
    }
    else {
      res.send({
        code: 404,
        error: 'The code is invalid'
      })
    }
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}