import { useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import Button from "./Button";
import { BiImage } from "react-icons/bi";
import { LexicalEditor } from "lexical";
import { INSERT_IMAGE_COMMAND } from "../editor/plugins/ImagesPlugin";

export default function ImageUpload({ editor }: { editor: LexicalEditor }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [src, setSrc] = useState<string>("");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function loadImage(files: FileList | null) {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
      }
      return "";
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  }

  function handleConfirm() {
    if (src !== "") {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {src, altText: ""});
      setSrc("");
      closeModal();
    }
  }

  return (
    <>
      <Button title={"Image Upload!"} onClick={openModal} isActive={false}>
        <BiImage className="h-6 w-6" />
      </Button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Upload Image
                  </Dialog.Title>
                  <div className="mt-2">
                    <input type="file" accept={"image/*"} className="" onChange={(e) => loadImage(e.target.files)} />
                  </div>
                  {src != "" && (
                    <div className="mt-4">
                      <Button onClick={handleConfirm} isActive={false} classNames={["rounded-md"]}>
                        Confirm
                      </Button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
