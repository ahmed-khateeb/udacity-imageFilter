import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url }: {image_url: string} = req.query
    //Validating the image_Url
    if(!image_url || image_url.trim() == "") {
      return res.status(422).send({message: "Please Enter Valid Image Url"})
    }
    try{
      //Calling the filterImageFromURL(image_url) to filter the image
      let imageFile = await filterImageFromURL(image_url)
      //Send the resulting file in the response
      await res.status(200).sendFile(imageFile, async ()=> {
        //Deletes any files on the server on finish of the response
        await deleteLocalFiles([imageFile])
      })
    }
    catch(error) {
      return res.status(422).send({message: "It Seems the url you entered isn't for an image"})
    }
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();