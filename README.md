## __1. Installation__
To install the agent, run the following
```shell
yarn install
```

## __2. Usage__

Open `config.json` file to input your workspace
```json
{
  "path": "E:\\amz-pc-app",  // path to your workingspace
  "username": "DaiNH",    // your username, ask DaiNH for this information
  "email": "dainguyen.dev@ecomgrows.com"
}
```
Finally, run the agent in 2 options as below

### _Option 1: create a shortcut and copy it to Startup folder (Recommend)_
- Right click on `HudyStalkerAgent.bat` file
- Choose `Create shortcut`
- Press `Window + R` and type `shell:startup`
- Explorer open path: `C:\Users\<username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`
- Copy the shortcut that was created at step 2 to here
- Now, everytime you open PC the script will be run automatically

### _Option 2: run the command_
```shell
$ node index.js
```
