function upload(){
    //fetch upload video file to server
    const data = new FormData();
    data.append("video",document.getElementById("video-input").files[0]);
    data.append("title",document.getElementById("title-input").value);
    uploadFile('/upload','PUT',data,(progress)=>{
        document.getElementById('upload-progress').value=progress;
    })
    .then(res=>JSON.parse(res))
    .then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    }
    )

}

function uploadFile(url, method, formData, onProgress){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', e => onProgress(e.loaded / e.total));
    xhr.addEventListener('load', () => resolve(xhr.response));
    xhr.addEventListener('error', () => reject(new Error('File upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
    xhr.open(method, url, true);
    
    xhr.send(formData);
  });
}


function download(video){
    window.open('/download?video='+video,'_blank');
}
function downloadProcessed(e){
    window.open('/downloadprocessed?video='+e,'_blank');
}
function deleteVideo(id){
    fetch('/delete?id='+id,{method:'DELETE'})
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        list();
    }).catch(err=>{
        console.log(err)
    }
    )
}

function list(){
    fetch('/list')
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        document.getElementById('list').innerHTML='';
        for(let d of data){
            const video = document.createElement('div');
            video.className = 'video';
            video.dataset.video=d.video;
            video.dataset.id=d.id;
            video.innerHTML = `<span>${d.title}</span> <button type='button' class="download-button" onclick="download(this.parentElement.dataset.video)">Download</button>
            <button type='button' class="download-processed-button" onclick="downloadProcessed(this.parentElement.dataset.video)">Download Processed</button>
            <button type='button' class="delete-button" onclick="deleteVideo(this.dataset.id)">Delete</button>`;
            document.getElementById('list').appendChild(video);
        }
    }).catch(err=>{
        console.log(err)
    }
    )
}

list();