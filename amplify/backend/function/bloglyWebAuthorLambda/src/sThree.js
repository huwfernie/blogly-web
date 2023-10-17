const { S3 } = require('@aws-sdk/client-s3');
const s3 = new S3();

async function sThreeMove(_old, _new) {
  const bucketName = 'bloglyweb40a6b9f4604449718a25012fe5dde19f125048-dev';        // example bucket
  const folderToMove = _old; //'folderToMove/';   // old folder name
  const destinationFolder = _new; //'destinationFolder/'; // new destination folder

  try {
      const listObjectsResponse = await s3.listObjects({
          Bucket: bucketName,
          Prefix: folderToMove,
          Delimiter: '/',
      });
  
      const folderContentInfo = listObjectsResponse.Contents;
      const folderPrefix = listObjectsResponse.Prefix;
      
      console.log(folderContentInfo);
      console.log(folderPrefix);
  
      await Promise.all(
        folderContentInfo.map(async (fileInfo) => {
          await s3.copyObject({
            Bucket: bucketName,
            CopySource: `${bucketName}/${fileInfo.Key}`,  // old file Key
            Key: `${destinationFolder}/${fileInfo.Key.replace(folderPrefix, '')}`, // new file Key
          });
      
          await s3.deleteObject({
            Bucket: bucketName,
            Key: fileInfo.Key,
          });
        })
      );
  } catch (err) {
    console.error(err); // error handling
  }
}

module.exports = sThreeMove;
