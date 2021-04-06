const express=require('express');
var cors = require('cors')
const {Base64} = require('js-base64');
const path = require('path');
const app=express();
const PORT=(process.env.PORT || 3000);
const { Octokit } = require("@octokit/core");
const bodyparser=require('body-parser');
app.use(cors());
app.use(bodyparser.json());
app.use(express.json({
  type: ['application/json', 'text/plain']
}));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});
app.post('/create/repo',async function(req,res){
  try{
    const octokit = new Octokit({ auth: req.body.token });
var response= await octokit.request('POST /user/repos', {
  name: req.body.name,
  description:'GeeksForGeeks',
  auto_init:true
});

if(response.status===201 || response.status===200)
{
  res.json(response);
}
else
{
  res.json({status:404});
}
}
catch(err)
{
  res.json({status:403});
}
});
app.post('/repo/user/list',async function(req,res){
try
{
  const octokit=new Octokit({auth:req.body.token});
  var response=await octokit.request('GET /user/repos');
  if(response.status===200)
  {
    res.json(response);
  }
  else
  {
    res.json({status:404});
  }
}
catch(err)
{
res.json({status:404});
}
});
app.post('/repo/user',async function(req, res){
  try{
      const octokit=new Octokit({auth:req.body.token});
  var response=await octokit.request('GET /user');
  if(response.status===200)
  {
    res.json(response)
  }
  else
  {
  res.json({status:404});
  }
}
catch(err)
{
  res.json({status:404});
}
});
app.post('/repo/createfile',async function(req,res){
  const octokit=new Octokit({auth:req.body.token});
  var path;
  if(req.body.file==='.c')
{
  path='C-Solution';
}
else if(req.body.file==='.cpp')
{
  path='C++-Solution';
}
else if(req.body.file==='.java')
{
  path='Java-Solution';
}
else if(req.body.file==='.py')
{
  path='Python-Solution';
}
else
{
  path='Text-Solution';
}
try{
if(typeof(path)!=='undefined')
{
  var filename=req.body.title+req.body.file;
  filename=filename.replace(/ +/g, "");
  var filepath=path+'/'+filename;
  var commit=await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: req.body.owner,
    repo: req.body.repo,
    path: filepath
})
if(commit.status===200 && commit)
{
  var str1=Base64.atob(commit.data.content);
  var str2=Base64.atob(req.body.content);
if(str1 && str2 && str1!==str2)
{
  var response=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
   owner: req.body.owner,
   repo: req.body.repo,
   path: filepath,
   message: req.body.title,
   content:req.body.content,
   sha:commit.data.sha
 });
 if(response.status===200)
 {
   res.json(response);
 }
 else
 {
res.json({status:404});
 }
}
else
{
  res.json({status:403});
}
}
else{
res.json({status:404});
}
}
}
catch (err) {
  createFile(octokit,req.body.owner,req.body.repo,req.body.title,req.body.content,req.body.file,res,filepath,req.body.exeTime,req.body.type,req.body.link);
}
});
async function readme(title,file,time,type,octokit,owner,repo,link)
{
var path;
var repoPath;
if(file==='.c')
{
path='C';
repoPath='C-Solution';
}
else if(file==='.cpp')
{
path='C++';
repoPath='C++-Solution';
}
else if(file==='.java')
{
path='Java';
repoPath='Java-Solution';
}
else if(file==='.py')
{
path='Python';
repoPath='Python-Solution';
}
else
{
path='Text';
repoPath='Text-Solution';
}
if(path && repoPath)
{

  try{
    var filename=title+file;
    filename=filename.replace(/ +/g, "");
    var filepath=repoPath+'/'+filename;
  var commit=await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner:owner,
    repo:repo,
    path:'README.md'
});
var str='\n'+'**GeeksForGeeks Solutions**<hr/>'+'\n'+'Manage by [gfggit](gfggit.com)'+'\n'+'|Slno.|Title|Level|Runtime|Language|'+'\n'+'|--|--|--|--|--|';
//|${1}|${title}|${type}|${time}|${path}
if(typeof(commit)!=='undefined')
{
  var str1=Base64.atob(commit.data.content);
  if(!str1.includes(str))
  {
    var arr=str.split("\n");
    var str2='';
    for(var i=0;i<arr.length;i++)
    {
      str2+='\n'+arr[i];
    }
    str2+='\n'+'|'+(arr.length-4)+'|'+'['+title+']'+'('+link+')'+'|'+type+'|'+time+'|'+'['+path+']'+'('+'https://github.com/'+owner+'/'+repo+'/tree/main/'+filepath+')'+'|';
      var response=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
     owner: owner,
     repo:repo,
     path: 'README.md',
     message: "my readme",
     content:Base64.btoa(str2),
     sha:commit.data.sha
   });
   if(response.status===200)
   {

   }
   else
   {

   }
  }
  else
  {
    var arr=str1.split("\n");
    var str2=str1+'\n'+'|'+(arr.length-5)+'|'+'['+title+']'+'('+link+')'+'|'+type+'|'+time+'|'+'['+path+']'+'('+'https://github.com/'+owner+'/'+repo+'/tree/main/'+filepath+')'+'|';
    var response=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
   owner: owner,
   repo:repo,
   path: 'README.md',
   message: "my readme",
   content:Base64.btoa(str2),
   sha:commit.data.sha
 });
 if(response.status===200)
 {


 }
 else
 {

 }

  }
}
else
{

}
}
catch(err)
{

}
}
}
async function createFile(octokit,owner,repo,title,content,file,res,filepath,exeTime,type,link)
{
  try{
    var response=await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
   owner: owner,
   repo: repo,
   path: filepath,
   message: title,
   content:content
 });
 if(response.status===200 || response.status===201)
 {
   readme(title,file,exeTime,type,octokit,owner,repo,link);
   res.json(response);
 }
 else
 {
  res.json({status:404});
 }
}
catch(err)
{
res.json({status:404});
}
}
app.listen(PORT,function(){
  console.log('connect to server');
});
