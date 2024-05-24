const express = require('express')
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const app = express()
const port = parseInt(process.env.PORT) || 8080;

var request = require('request');

const axios = require('axios');



app.use(bodyParser.json({ limit: '50mb' }));

const { exec } = require('child_process');

// Function to run a shell command
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
       {
        resolve(stdout);
      }
    });
  });
}


app.get('/', (req, res) => {
  res.send('fake google lens');
})

app.get('/image_query', async (req, res) => {
  const base64image = req.query.image;


  require("fs").writeFile("out.jpg", base64image, 'base64', function(err) {
    console.log(err);
  });

  res.send('success')
});


app.post('/upload', async (req, res) => {
    const { base64Image, fileName } = req.body;
    console.log('receiving upload..')
    // Check if base64Image and fileName are provided
    if (!base64Image || !fileName) {
      return res.status(400).json({ message: 'Base64 image and file name are required.' });
    }
  
    // Decode base64 image
    const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, '');
  
    // Write binary data to a file
    const filePath = fileName
    console.log('writing file...')

    await fs.writeFile(filePath, base64Data, 'base64')

    console.log('written file')
    command = '../llama.cpp/llava-cli -m ../llava-llama-3-8b-v1_1-f16.gguf --mmproj ../llava-llama-3-8b-v1_1-mmproj-f16.gguf --image ' + fileName + ' -c 4096 -e -p "<|start_header_id|>user<|end_header_id|>\n\n<image>\nDescribe this image one word.<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"'
    // command2 = '../llama.cpp/llava-cli -m ../llava-llama-3-8b-v1_1-f16.gguf --mmproj ../llava-llama-3-8b-v1_1-mmproj-f16.gguf --image ../image2.jpeg -c 128 -e -p "<|start_header_id|>user<|end_header_id|>\n\n<image>\nDescribe this image one word.<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"'
    console.log('running model...')
    console.log(command)
    var output = await runCommand(command)

    console.log('Result from image: ' + output.trim())


    var as = await axios.get('https://qnode.eu/ows/mosaic/service/search?limit=3&q=' + output.trim() + '')

    var entries = as.data['results'][0]['demo-simplewiki']
    console.log(entries)

    snippets = []

    counter = 0

    for(entry of entries)
    {
        snippets.push(entry['textSnippet'])
    }


    var llminput = snippets.join(" ")

    console.log('running llm...')
    console.log('python3 llm.py "' + llminput + '"')

    var llmoutput = await runCommand('python3 llm.py "' + llminput + '"')


    console.log(llmoutput)
    res.send(llmoutput)
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})