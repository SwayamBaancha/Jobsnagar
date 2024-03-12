"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useMemo, ChangeEvent } from "react";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import axiosInstance from "@/app/axiosInstance";
import axios from "axios";
import { Image, ImageComponentType } from "@/type/type";
import { toast } from "react-toastify";

export default function ImageComponent(props: ImageComponentType) {
  // console.log(props, "img");

  const [files, setFiles] = useState<Image[]>([]);
  // console.log(files, "img1");

  const [previews, setPreview] = useState("");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef<AvatarEditor>(null);

  const onClickSave = async () => {
    if (editorRef.current) {
      const dataUrl = editorRef.current.getImage().toDataURL();
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      setPreview(URL.createObjectURL(blob));
      await extractImage(blob);
    }
  };

  const extractImage = async (blob: Blob) => {
    // console.log(blob, "img2");

    let image: any = await axiosInstance.get("/aws-services").catch((error) => {
      toast.error(error);
    });
    // console.log(image, "img3");

    const url = image?.data;
    const reader = new FileReader();
    reader.onloadend = async function () {
      const arrayBuffer = reader.result;

      await axios
        .put(url, arrayBuffer, {
          headers: {
            "Content-Type": blob.type,
          },
        })
        .then((res) => {
          // console.log(res);
        })
        .catch((error) => {
          // console.log(error);
          toast.error(error);
        });
      const imageUrl = url.split("?")[0];
      // console.log("imu", imageUrl);
      props.onImgUrlChange(imageUrl);
      return imageUrl;
    };

    reader.readAsArrayBuffer(blob);
  };

  const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e, "img4");

    const scale = parseFloat(e.target.value);
    setZoom(scale);
  };

  const handleShowGrid = () =>
    showGrid === false ? setShowGrid(true) : setShowGrid(false);
  //   setState({
  //     ...state,
  //     position: { ...state.position, x: parseFloat(e.target.value) },
  //   });
  // };

  // const handleYPosition = (e: ChangeEvent<HTMLInputElement>) => {
  //   setState({
  //     ...state,
  //     position: { ...state.position, y: parseFloat(e.target.value) },
  //   });
  // };

  const rotateScale = (e: ChangeEvent<HTMLInputElement>) => {
    setRotate(parseFloat(e.target.value));
  };

  const rotateLeft = () => {
    setRotate((rotate - 90) % 360);
  };

  const rotateRight = () => {
    setRotate((rotate + 90) % 360);
  };

  const handleDrop = (acceptedFiles: any) => {
    console.log(acceptedFiles, "acceptedFiles");

    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      setFiles([
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ]);
    }
  };

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const focusedStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={props.closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="title text-2xl font-bold text-center text-red-700"
                  >
                    Jobsnagar Image Uploader
                  </Dialog.Title>
                  <div className="mt-4">
                    <Dropzone onDrop={handleDrop}>
                      {({
                        getRootProps,
                        getInputProps,
                        isFocused,
                        isDragAccept,
                        isDragReject,
                      }) => {
                        const style = useMemo(
                          () => ({
                            ...baseStyle,
                            ...(isFocused ? focusedStyle : {}),
                            ...(isDragAccept ? acceptStyle : {}),
                            ...(isDragReject ? rejectStyle : {}),
                          }),
                          [isFocused, isDragAccept, isDragReject]
                        );

                        return (
                          <section>
                            <div
                              {...getRootProps()}
                              className="mt-10 border-dotted border-2 border-neutral-300"
                            >
                              <p className=" m-auto text-center text-xs text-gray-400 capitalize align-center">
                                Drop your files here or click the box to upload
                                file
                              </p>
                              <AvatarEditor
                                ref={editorRef}
                                image={files[0]?.preview}
                                width={250}
                                height={250}
                                border={50}
                                color={[255, 255, 255, 0.6]} // RGBA
                                scale={zoom}
                                rotate={rotate}
                              />
                              <input {...getInputProps()} />
                            </div>
                            <div className="text-center">
                              ZooM:{" "}
                              <input
                                name="scale"
                                type="range"
                                onChange={handleScale}
                                min={zoom ? "0.1" : "1"}
                                max="2"
                                step="0.01"
                              />
                              <br />
                              Show grid:{" "}
                              <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={handleShowGrid}
                              />
                              <br></br>
                              Rotate:
                              <button
                                className="bg-purple-700 p-2 rounded-xl mr-2 text-white"
                                onClick={rotateLeft}
                              >
                                Left
                              </button>
                              <button
                                onClick={rotateRight}
                                className="bg-purple-700 p-2 rounded-xl text-white "
                              >
                                Right
                              </button>
                              <br></br>
                              Rotation:
                              <input
                                name="rotation"
                                type="range"
                                onChange={rotateScale}
                                min="0"
                                max="180"
                                step="1"
                              />
                              <br />
                            </div>
                            <button
                              onClick={onClickSave}
                              className="bg-red-700 p-3 rounded-lg text-white float-right mt-3"
                            >
                              Save Cropped Image
                            </button>
                          </section>
                        );
                      }}
                    </Dropzone>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
