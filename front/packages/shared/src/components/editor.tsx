import '@toast-ui/editor/dist/toastui-editor.css';
import { ToolbarItemOptions } from "@toast-ui/editor/types/ui";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HookCallback } from '@toast-ui/editor/types/editor';

const DefaultToolbarItems = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'indent', 'outdent'],
    ['table', 'image', 'link'],
] as (string | ToolbarItemOptions)[][];

type PropsType = { 
    initialValue?:string,
    toolbarItems?:undefined | (string | ToolbarItemOptions)[][],
    setValue: UseFormSetValue<any>,
    keyOfValue?: string
    uploadPromise: ({data, config} : {data: FormData, config?: AxiosRequestConfig}) => Promise<AxiosResponse<any, any>>
}

const ToastEditor = ({initialValue, toolbarItems, setValue, keyOfValue="content", uploadPromise} : PropsType) => {
    let tItems = !toolbarItems ? DefaultToolbarItems : toolbarItems;

    useEffect( () => {
        setValue(keyOfValue, initialValue);
    }, []);
    
    const editorRef = useRef<Editor | null>(null);
    return (
        <Editor
            initialValue={initialValue}
            toolbarItems={tItems}
            usageStatistics={false}
            hideModeSwitch={true}
            initialEditType={"wysiwyg"}
            hooks={{
                addImageBlobHook: async (item: Blob | File, callback: HookCallback) => {
                    try{
                        const formData = new FormData();

                        const arrayBuffer = await item.arrayBuffer();
                        const blob = new Blob([new Uint8Array(arrayBuffer)], { type : item.type} );
                        formData.append('files', blob, item instanceof File ? item.name:'');
                        formData.append('isPermanent', String(true));

                        const {data} = await uploadPromise({
                            data: formData
                        });
                        
                        const [uploaded] = data;
                        const {download} = uploaded;
                        callback(download);
                    } catch(e) {
                        console.error(e);
                    }
                }
            }}
            ref={editorRef}
            onChange={()=>{
                const {current} = editorRef;
                if(!current) return;
                
                const instance = current.getInstance();
                const html = instance.getHTML();
                setValue(keyOfValue, html);
            }}
        />
    )
}

export default ToastEditor;