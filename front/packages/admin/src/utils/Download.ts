import streamSaver from "streamsaver";

export function download(blob:Blob, filename:string) {
    const fileStream = streamSaver.createWriteStream(filename, {
        size: blob.size,
    });

    new Response(blob).body?.pipeTo(fileStream)
    .then(
    (success)=>{
        console.info(success);
    }, 
    (error)=>{
        console.error(error);
    });

    /* const writer = fileStream.getWriter()
    writer.write(blob)
    writer.close() */
}