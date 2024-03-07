import { IStaffUser } from "@betaschool-reborn/beta-data-type";

export const userdetails = (req, res, next) => {
  const { user } = req;
  res.json({
      success: true,
      message: 'successfull',
      ...user
  })
}