DocumentTimeline.getElementById("fileInpiut").addEventListener('change',function(event)
{
    const file = event.target.files[0];
    if(file)
    {
        console.log('File selected: ', file.name);
    }
});