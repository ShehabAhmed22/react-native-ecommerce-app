import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, categoryApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const queryClient = useQueryClient();

  // ✅ FIX: extract data correctly
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  const products = productsData?.data || [];

  // categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
  });

  const categories = categoriesData?.data || [];

  // mutations
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });

    setImagePreviews(
      product.images.map((img) => (typeof img === "string" ? img : img.url)),
    );

    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Maximum 3 images allowed");

    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editingProduct && images.length === 0) {
      return alert("Please upload at least one image");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    if (images.length > 0) {
      images.forEach((image) => formDataToSend.append("images", image));
    }

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        formData: formDataToSend,
      });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => {
          const status = getStockStatusBadge(product.stock);

          const firstImage = product.images?.[0]
            ? typeof product.images[0] === "string"
              ? product.images[0]
              : product.images[0].url
            : null;

          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex gap-6">
                  {firstImage && (
                    <div className="avatar">
                      <div className="w-20 rounded-xl">
                        <img src={firstImage} />
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="card-title">{product.name}</h3>

                    <p className="text-sm text-gray-500">
                      {product.category?.name || "Uncategorized"}
                    </p>

                    <div className="flex gap-6 mt-2">
                      <span>${product.price}</span>
                      <span>{product.stock} stock</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-square"
                    onClick={() => handleEdit(product)}
                  >
                    <PencilIcon />
                  </button>

                  <button
                    className="btn btn-square text-error"
                    onClick={() => deleteProductMutation.mutate(product._id)}
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <dialog className={`modal ${showModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-xl">
            {editingProduct ? "Edit" : "Add"} Product
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="input input-bordered w-full"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <select
              className="select select-bordered w-full"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              className="input"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />

            <textarea
              className="textarea"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <input type="file" multiple onChange={handleImageChange} />

            <div className="flex gap-2">
              {imagePreviews.map((img, i) => (
                <img key={i} src={img} className="w-16 h-16" />
              ))}
            </div>

            <button className="btn btn-primary w-full">
              {editingProduct ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default ProductsPage;
