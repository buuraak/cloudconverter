const CloudConvert = require('cloudconvert');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const compressor = new CloudConvert(process.env.CLOUDCONVERT_KEY);
const app = express();
const port = process.env.PORT;
const AWS_URL = process.env.AWS_URL;

app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.header('Access-Control-Allow-Methods', 'POST');
    next();
});


app.get('/', (request, response) => {
    response.send('<h1>This app only works when compressing an image through the <a href="https://image-optimizer-amber.vercel.app/">Image compressor</a> app</h1>');
});

app.post('/compress-image', async (request, response) => {
    if(!request.body.file) {
        response.status(400).json({error: "Missing required file property"});
        return;
    }

    let fileUrl = `${AWS_URL}/${request.body.file}`;

    try {
        let job = await compressor.jobs.create({
            "tasks": {
                "import": {
                    "operation": "import/url",
                    "url": fileUrl,
                    "filename": request.body.file
                },
                "optimize": {
                    "operation": "optimize",
                    "input": [
                        "import"
                    ]
                },
                "export-optimized": {
                    "operation": "export/url",
                    "input": [
                        "optimize"
                    ],
                    "inline": false,
                    "archive_multiple_files": false
                }
            },
            "tag": "jobbuilder"
        });

        job = await compressor.jobs.wait(job.id);

        const file = compressor.jobs.getExportUrls(job)[0];

        response.status(200).json({message: "Succesfully compressed image", file});

    } catch(error) {
        response.status(500).json({error});
    }
});

app.listen(port);
