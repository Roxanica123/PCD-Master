import express from "express";
import cors from "cors";
import multer from "multer";
import morgan from 'morgan';
import { UploadHandler } from "./handlers/upload_handler";


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

// app.get("/problems", async function (req: any, res: any) {
//   res = setCorsOrigin(res);
//   const result = await new PetHandler().getAllPets()
//   res.statusCode = result.statusCode;
//   res.end(result.body);
// });

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Core API listening at http://0.0.0.0:${PORT}`);
});