
function sThreadRunner()
{

    if (Array.prototype.shift == null)
    {
        Array.prototype.shift = function()
        {
            var rs = this[0];
            for (var i = 1; i < this.length; i++) this[i - 1] = this[i]
            this.length = this.length - 1
            return rs;
        }
    }
    
    if (Array.prototype.push == null)
    {
        Array.prototype.push = function()
        {
            for (var i = 0; i < arguments.length; i++) this[this.length] = arguments[i];
            return this.length;
        }
    }
    
var commandList = [];
var nAction = 0;//控制每次运行多少个动作
var nCommand = 1;
var functionConstructor = function() { } .constructor;
var mySelf = this;
var timeID = null;

    if (typeof sThreadRunner._initialized == "undefined")
    {

        sThreadRunner.prototype.executeCommands = function()
        {

            if (commandList.length > 0)
            {
                var command = commandList.shift();
                if (command.constructor == functionConstructor)
                {
//                    if (command.scheduleTime == null || nCommand - command.scheduleTime >= 0)
//                    {
                        command();
                        window.status = "开始执行 " + nCommand + " " + command.scheduleTime;
                        command.scheduleTime = null;
//                    }
//                    else
//                    {
//                        commandList.push(command);
//                        window.status = "放后执行 " + nCommand + " " + command.scheduleTime;
//                    }
                }
                command = null;
                nCommand++;
                timeID = window.setTimeout(mySelf.executeCommands,1);
            }
            else
            {
                nAction = 0;
                nCommand = 0;
            }
            
            
        };

        

        sThreadRunner.prototype.startNewTask = function(command)
        {
            nAction = nAction + 1;
            command.scheduleTime = nAction;
            commandList.push(command);
            window.status = "增加任务" + nAction;
        };

        sThreadRunner.prototype.startTask =function()        
        {
            timeID = window.setTimeout(this.executeCommands,1);
        }

        sThreadRunner.prototype.removeAllTask = function()
        {
            if(timeID != null)
            {
                window.clearTimeout(timeID);
            }
            commandList.clear();
            nAction = 0;
            nCommand = 0;
        };

        sThreadRunner.prototype.reduceAction = function()
        {
            nAction--
        };

        sThreadRunner.prototype.addAction = function()
        {
            nAction++;
        };

        sThreadRunner.prototype.getAction = function()
        {
            return nAction;
        };

        //开始线程任务
        //setInterval(mySelf.executeCommands, 100);
        

    }
    sThreadRunner._initialized = true;
};


var currentThreadRunner = new sThreadRunner();





