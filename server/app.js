const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const { exec } = require('child_process');
app.use(cors());

const token =""
app.get('/api/repo',cors(), async (req, res) => {
  try {
    const fetchDirectoryContent = async (path) => {
      const headers = { 'Authorization': token };
      const response = await axios.get(`https://api.github.com/repos/bjayakumarmca/vul-scan-repo/contents/${path}`, { headers });
      return response.data;
    };

    const queue = [''];
    const structure = {};

    while (queue.length > 0) {
      const path = queue.shift();
      let content;
      try {
        content = await fetchDirectoryContent(path);
      } catch (error) {
        console.error(`Error fetching directory content: ${error}`);
        continue;
      }

      structure[path] = content.map(item => item.name);

      const directories = content.filter(item => item.type === 'dir').map(item => item.path);
      queue.push(...directories);
    }

    res.send(structure);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching data from GitHub' });
  }
});

app.get('/api/file', cors(),async (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      res.status(400).send({ message: 'Missing file path' });
      return;
    }

    const headers = { 'Authorization': token };
    const response = await axios.get(`https://api.github.com/repos/bjayakumarmca/vul-scan-repo/contents/${filePath}`, { headers });

    // GitHub API returns file content in base64 format, so we need to decode it
    const content = Buffer.from(response.data.content, 'base64').toString('utf8');

    res.send({ path: filePath, content: content });
  } catch (error) {
    res.status(500).send({ message: 'Error fetching file content from GitHub' });
  }
});

app.get('/runTask', async(request,response) =>{
 
  console.log("runTask() called");
  const taskName ='Test.robot';
  console.log("Task:"+taskName);
  const directoryPath = 'C:\\Users\\AmitMehta\\Documents\\projects\\POC_CODE\\server';
  await exec('python -m robot '+taskName, { cwd: directoryPath }, (error, stdout, stderr) => {
    console.log("Robot");
    if (error) {
      console.error(`Error executing command: ${error.message}`);
    }
    if (stderr) {
      console.error(`STD Error executing command: ${stderr}`);
    }
    response.status(200); 
    response.send({
      "message": "Success"
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});