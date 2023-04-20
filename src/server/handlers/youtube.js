const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg')
const youtubeDl = require('@microlink/youtube-dl');

function exists(filename, cb) {
  fs.access(filename, fs.F_OK, (err) => {
      if (!err) {
            cb(true);
                } else {
                      cb(false);
                          }
                            });
                            }

                            function download(url, options = {
                              path: 'downloads',
                                audioOnly: false
                                }) {
                                  return new Promise((resolve, reject) => {
                                      // TODO Add proper support for options
                                          const video = youtubeDl(url,
                                                // Optional arguments passed to youtube-dl.
                                                      ['--format=18'],
                                                            // Additional options can be given for calling `child_process.execFile()`.
                                                                  { cwd: __dirname, maxBuffer: Infinity });

                                                                      // Will be called when the download starts.
                                                                          video.on('info', info => {
                                                                                let filename = info._filename;
                                                                                      filename = filename
                                                                                              .replace('.mp4', '')
                                                                                                      .substring(0, filename.length - 16);

                                                                                                            const filePath = path.join(options.path, `${filename}.mp4`);

                                                                                                                  exists(filePath, (doesExist) => {
                                                                                                                          const videoObj = {
                                                                                                                                    name: filename,
                                                                                                                                              url,
                                                                                                                                                        downloading: false,
                                                                                                                                                                  format: 'mp4'
                                                                                                                                                                          };

                                                                                                                                                                                  if (!doesExist) {
                                                                                                                                                                                            // Save the downloaded video file
                                                                                                                                                                                                      video.pipe(fs.createWriteStream(filePath))
                                                                                                                                                                                                                  .on('finish', () => {
                                                                                                                                                                                                                                resolve(videoObj);
                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                                              resolve(videoObj);
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                  module.exports = {
                                                                                                                                                                                                                                                                                    download
                                                                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                                                                    
