import { Request, Response } from 'express'
import { settings, users } from '../utils/models'
import { authorize } from '../utils/firebase'

export default async function check_out(req: Request, res: Response) {
	const user = await authorize(req.body.auth)
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]
	const weekdays = ['Tuesday', 'Thursday']

  if (!user) {
		res.status(400).json({ err: 'Unauthorized request!' })
		return
	}

  const setting = await settings.findOne({ key: "checkOutPassword" })
  if (req.body.password !== setting.value) {
    res.status(400).json({ err: "Check Out Password Wrong! "})
    return
  }

	const userDoc = await users.findOne({ uid: user.uid })
	const attendanceOverride = await settings.findOne({ key: 'attendanceOverride' })

	var date = new Date(Date.now() * 1000 - 1000 * 8 * 3600)

  if (userDoc.attendanceStatus !== "logging") {
		res.status(400).json({ err: 'You are not checked in!' })
  }
  else if (attendanceOverride) {
		userDoc.lastCheckIn = Date.now()
  }
	else if (weekdays.includes(days[date.getDay()])) {
		if (date.getHours() >= 15 && date.getHours() <= 18) {
			userDoc.lastCheckIn = Date.now()
      userDoc.attendanceStatus = "notLogging"
		} else {
			res.status(400).json({ err: 'Not in meeting time!' })
			return
		}
	} else if (days[date.getDay()] === 'Saturday') {
		if (date.getHours() >= 8 && date.getHours() <= 17) {
			userDoc.lastCheckIn = Date.now()
      userDoc.attendanceStatus = "notLogging"
		} else {
			res.status(400).json({ err: 'Not in meeting time!' })
			return
		}
	} else {
		res.status(400).json({ err: 'No meeting today!' })
		return
	}

  if (userDoc.lastCheckIn === null) {
    res.status(400).json({ err: "You haven't checked in" })
    return
  }

  const timeElapsed = Date.now() - userDoc.lastCheckIn

  userDoc.seconds += timeElapsed

  await userDoc.save()

  res.status(200).json({ err: false })
}