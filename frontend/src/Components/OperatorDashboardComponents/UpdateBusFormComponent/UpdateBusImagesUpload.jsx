import React, { useEffect, useState } from 'react'
import { useFormContext, Controller } from "react-hook-form";
import { toast } from "sonner";

const UpdateBusImagesUpload = () => {
    const { control, setValue, getValues, formState: { errors } } = useFormContext();
    const [previewImages, setPreviewImages] = useState([]);


    useEffect(() => {
        const existing = getValues("existingImages") || [];
        const existingPreviews = existing.map(url => ({
            url, isExisting: true
        }))
        setPreviewImages(existingPreviews)
    }, getValues)
    const hanldeImageChange = (e, onChange) => {
        const files = Array.from(e.target.files);
        // current form value
        const currentFiles = getValues("images") || [];


        // Limit total to 6 (existing + new)
        const totalexisting = previewImages.filter(img => img.isExisting).length
        const allowedFiles = files.slice(0, 6 - currentFiles.length - totalexisting);

        if (allowedFiles.length < files.length) {
            toast.error("You can only upload maximum 6 images");
        }
        const newFiles = [...currentFiles, ...allowedFiles];

        // Update preview
        const newPreviews = allowedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            isExisting: false
        }));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
        onChange(newFiles);
        setValue("images", newFiles);
    }
    // Handle Delete
    const handleDeleteImage = (index, value, onChange) => {
        const imgToDelete = previewImages[index]

        if (imgToDelete.isExisting) {
            // existing image → add to deletedImages array
            const currentDeleted = getValues("deletedImages") || [];
            setValue("deletedImages", [...currentDeleted, imgToDelete.url]);
        } else {
            // remove from new files array
            const updated = [...value];
            updated.splice(
                value.findIndex(file => URL.createObjectURL(file) === imgToDelete.url),
                1
            );
            onChange(updated);
            setValue("images", updated);
        }
        // remove from preview
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };
    return (
        <div className="p-5">
            <h3 className="text-lg font-semibold mb-4">Upload Bus Images</h3>

            <Controller
                control={control}
                name="images"
                rules={{
                    validate: () => {
                        const existing = getValues("existingImages") || [];
                        const newImages = getValues("images") || [];
                        return existing.length > 0 || newImages.length > 0
                            ? true
                            : "At least one image is required";
                    }
                }}
                render={({ field: { onChange, value = [] } }) => (
                    <>
                        <div className="flex flex-col gap-2">
                            <label className="block font-medium">Upload Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => hanldeImageChange(e, onChange)}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>

                        {/* Error */}
                        {errors.images && (
                            <p className="text-red-500 text-center mt-2 mb-2">
                                {errors.images.message}
                            </p>
                        )}

                        {/* Previews */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {previewImages.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img.url}
                                        alt="preview"
                                        className="w-full h-40 object-cover rounded-lg shadow-md"
                                    />
                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(index, value, onChange)}
                                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            />
        </div>
    )
}

export default UpdateBusImagesUpload