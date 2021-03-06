'use strict';

const AWS = require('aws-sdk');
const config = require('./config.json');

const S3 = new AWS.S3();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const data = {
  userId: '12342',
  name: 'Dat Dinh',
  email: 'test@gmail.com',
  city: 'HCM',
  country: 'Vietnam',
};

exports.putData = async event => {
  try {
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: `upload-to-s3`,
      Body: JSON.stringify(data),
      ContentType: 'application/json; charset=utf-8',
    };

    await S3.putObject(params).promise();
    console.log('Upload Completed!!!');
  } catch (error) {
    console.log('Upload Failed!!!');
    console.log(error);
  }
};

exports.getData = async event => {
  try {
    const dataS3 = await S3.getObject({
      Bucket: config.S3_BUCKET_NAME,
      Key: `upload-to-s3`,
    }).promise();

    const response = JSON.parse(dataS3.Body);
    console.log('Get Data Successfully!!!');
    console.log('S3 data:', response);

    dynamoDB
      .put({
        Item: response,
        TableName: config.DYNAMODB_NAME,
      })
      .promise();

    console.log('Insert Data Successfully!!!');
  } catch (error) {
    console.log('Error!!!');
    console.log(error);
  }
};
