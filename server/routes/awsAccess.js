import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
// TODO user models with new db layout
import {User} from '../models/models';

AWS.config.update(
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

const router = express.Router();
// Amazon s3 config
const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 },
});

router.post('/upload', upload.single('demo'), (req, res) => {
  const toSave = req.user._id + (req.query.name || req.file.originalname);
  console.log('htuhuhdusdsudhushudshdsd', req.file);
  s3.putObject({
    Bucket: 'walnut-test',
    Key: toSave,
    Body: req.file.buffer,
    ACL: 'public-read',
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
      return;
    }
    User.findOne({owner: req.user._id})
    .then((user) => {
      const newFile = {
        fileName: req.query.name || req.file.originalname,
        fileType: req.file.mimetype,
        fileUrl: process.env.AWS_BUCKET_URL + toSave
      };
      user.portfolio[req.query.port].push(newFile);
      return user.save();
    })
    .then((user) => {
      console.log('user object after save. check new name!!!!', user);
      res.json({portfolio: user.portfolio});
    })
    .catch((error) => console.log('error in aws db save', error));
  });
  console.log('newName', req.query.name);
});


module.exports = router;