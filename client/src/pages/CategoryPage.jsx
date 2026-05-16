import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../lib/api";

function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  // ✅ fetch categories
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });

  const categories = data?.data || []; // مهم بسبب شكل الريسبونس

  // ✅ mutations
  const createMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: categoryApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setName("");
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) return alert("Name is required");

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory._id,
        body: { name },
      });
    } else {
      createMutation.mutate({ name });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-base-content/70 mt-1">Manage your categories</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="card bg-base-100 shadow-xl">
            <div className="card-body flex items-center justify-between">
              <h3 className="font-bold text-lg">{cat.name}</h3>

              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-ghost"
                  onClick={() => handleEdit(cat)}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>

                <button
                  className="btn btn-square btn-ghost text-error"
                  onClick={() => deleteMutation.mutate(cat._id)}
                >
                  {deleteMutation.isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <Trash2Icon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <dialog className={`modal ${showModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Category name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="modal-action">
              <button type="button" onClick={closeModal} className="btn">
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : editingCategory ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="modal-backdrop" onClick={closeModal} />
      </dialog>
    </div>
  );
}

export default CategoriesPage;
