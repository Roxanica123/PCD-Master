import express from "express";
import cors from "cors";
import multer from "multer";
import morgan from 'morgan';
import { UploadHandler } from "./handlers/upload_handler";
import { AuctionHandler } from "./handlers/auction_handler";
import { PetHandler} from "./handlers/pets_handler";

const app = express();
const upload = multer();
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status'));

function setCorsOrigin(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH");
  res.setHeader("Access-Control-Max-Age", 3600);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  return res;
}

app.get(
  "/", async (req:any, res:any) => {
   res.send("Hello world!")
  }
)

app.get(
  "/pets", async (req:any, res:any) => {
    let pets = await new PetHandler().getPets()
    res.send( pets )
  }
)

app.get(
  "/pet/:name", async (req:any, res:any) => {

    let pet_name = req.params.name;

    let pet = await new PetHandler().getPet(pet_name)

    if(pet == undefined) {
      res.status(204).send()
      return;
    }

    res.send( pet )
  }
)

app.post(
  "/upload",
  upload.fields([
    { name: "photos", maxCount: 10 },
  ]),
  async function (req: any, res: any, err: any) {
    res = setCorsOrigin(res);
    const response = await new UploadHandler(req).handle();
    res.statusCode = response.statusCode;
    if (res.statusCode == 201) {
      res.setHeader("Location", req.url + "/" + response.redirectLocation);
    }
    res.end(response.body);
  }
);

app.post("/start", async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const result = await new AuctionHandler(req.body).startAuction();
  res.statusCode = result.statusCode;
  res.end(result.body);
});

const formBodyParser = express.urlencoded({extended: false});
const jsonBodyParser = express.json();

// List of all messages received by this instance
const messages: string[] = [];

app.post('/pubsub/push', jsonBodyParser, (req:any, res:any) => {
  if (req.query.token !== "token_super_secret") {
    res.status(400).send();
    return;
  }

  // The message is a unicode string encoded in base64.
  const message = Buffer.from(req.body.message.data, 'base64').toString(
    'utf-8'
  );

  messages.push(message);

  res.status(200).send({messages: messages});
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Core API listening at http://127.0.0.1:${PORT}`);
});