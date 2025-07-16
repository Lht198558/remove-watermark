const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const inputEl = document.getElementById('video-input');
const btn = document.getElementById('process-btn');
const container = document.getElementById('video-container');

inputEl.addEventListener('change', () => {
  if (inputEl.files.length) {
    btn.disabled = false;
  }
});

btn.addEventListener('click', async () => {
  btn.textContent = '加载中...';
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const file = inputEl.files[0];
  ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(file));

  // 模糊整个视频中间区域，简单模拟去水印
  await ffmpeg.run('-i', 'in.mp4', '-vf', "delogo=x=iw*0.1:y=ih*0.1:w=iw*0.8:h=ih*0.8", '-c:a', 'copy', 'out.mp4');

  const data = ffmpeg.FS('readFile', 'out.mp4');
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

  container.innerHTML = `<video controls src="${url}"></video>
    <a href="${url}" download="no-watermark.mp4">下载去水印视频</a>`;

  btn.textContent = '开始去水印';
});
