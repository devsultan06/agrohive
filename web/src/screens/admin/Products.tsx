import { useState, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productService,
  type Product,
} from "../../services/admin/productService";
import OfflineState from "../../components/common/OfflineState";

const AdminProducts = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("New Products");
  const [stock, setStock] = useState("0");
  const [isActive, setIsActive] = useState("true");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-products", activeTab, localSearch],
    queryFn: () =>
      productService.getProducts({
        category: activeTab === "All" ? undefined : activeTab,
        search: localSearch,
      }),
    refetchOnReconnect: true,
  });

  const createMutation = useMutation({
    mutationFn: (variables: { payload: any; file?: File }) =>
      productService.createProduct(variables.payload, variables.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: string; payload: any; file?: File }) =>
      productService.updateProduct(
        variables.id,
        variables.payload,
        variables.file,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("New Products");
    setStock("0");
    setIsActive("true");
    setSelectedImage(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setStock(product.stock.toString());
    setIsActive(product.isActive.toString());
    setImagePreview(product.imageUrl);
    setShowAddModal(true);
  };

  const handleSave = () => {
    const payload = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      isActive: isActive === "true",
    };

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        payload,
        file: selectedImage || undefined,
      });
    } else {
      createMutation.mutate({ payload, file: selectedImage || undefined });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout title="Products">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Total products</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {products.length}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Active</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {products.filter((p: Product) => p.isActive).length}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">New Products</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {
                products.filter((p: Product) => p.category === "New Products")
                  .length
              }
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">UK Used</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {products.filter((p: Product) => p.category === "UK Used").length}
            </p>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-0.5 bg-[#F9FAFB] rounded-lg border border-[#EAECF0]">
                {["All", "New Products", "UK Used"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === tab ? "bg-white text-[#344054] shadow-sm" : "text-[#667085]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-lg w-64">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#98A2B3"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none text-[12px] w-full text-[#667085] placeholder:text-[#98A2B3]"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005] transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add product
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085]">
                <th className="px-5 py-2.5 font-medium">Product</th>
                <th className="px-5 py-2.5 font-medium">Category</th>
                <th className="px-5 py-2.5 font-medium">Price</th>
                <th className="px-5 py-2.5 font-medium">Stock</th>
                <th className="px-5 py-2.5 font-medium">Rating</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: Product) => (
                <tr
                  key={p.id}
                  className="border-b border-[#F2F4F7] last:border-0 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          p.imageUrl ||
                          "https://placehold.co/400x400/F2F4F7/667085?text=Product"
                        }
                        className="w-9 h-9 rounded-lg object-cover"
                        alt=""
                      />
                      <div>
                        <p className="text-[13px] font-medium text-[#101828]">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-[#98A2B3]">
                          Added {formatDate(p.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${p.category === "New Products" ? "bg-[#EFF8FF] text-[#175CD3]" : "bg-[#FFFAEB] text-[#B54708]"}`}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-medium text-[#101828]">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.stock > 5 ? "bg-[#12B76A]" : p.stock > 0 ? "bg-[#FDB022]" : "bg-[#F04438]"}`}
                          style={{
                            width: `${Math.min(100, (p.stock / 50) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-[12px] text-[#667085]">
                        {p.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[#667085]">
                    ⭐ {p.rating.toFixed(1)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${p.isActive ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#F2F4F7] text-[#667085]"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 text-[#667085] hover:text-[#1C6206] hover:bg-[#ECFDF3] rounded-md transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-[#667085] hover:text-[#F04438] hover:bg-[#FEF3F2] rounded-md transition-all disabled:opacity-50"
                      >
                        {deleteMutation.isPending &&
                        deleteMutation.variables === p.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-[#F04438]/30 border-t-[#F04438] rounded-full animate-spin" />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isError && (
            <div className="py-12">
              <OfflineState onRetry={() => refetch()} />
            </div>
          )}

          {!isError && products.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D0D5DD"
                strokeWidth="1"
                className="mx-auto mb-3"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-[14px] font-medium text-[#101828]">
                No products found
              </p>
              <p className="text-[12px] text-[#667085]">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}

          <div className="px-5 py-3 border-t border-[#EAECF0] flex justify-between items-center text-[12px] text-[#667085]">
            <p>Showing {products.length} products</p>
            <div className="flex gap-1">
              <button
                disabled
                className="px-3 py-1 border border-[#EAECF0] rounded-md text-[#D0D5DD] cursor-not-allowed font-medium"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3 py-1 border border-[#EAECF0] rounded-md text-[#D0D5DD] cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#101828]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg relative z-10 shadow-xl overflow-hidden"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="px-6 py-4 border-b border-[#EAECF0] flex justify-between items-center">
                <h2 className="text-[15px] font-semibold text-[#101828]">
                  {editingProduct ? "Edit product" : "Add new product"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-[#98A2B3] hover:text-[#F04438]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                    Product name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rotavator"
                    className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
                <div>
                  <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206] resize-none"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                      style={{ fontFamily: "inherit" }}
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                      style={{ fontFamily: "inherit" }}
                    >
                      <option>New Products</option>
                      <option>UK Used</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Stock quantity
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px]"
                      style={{ fontFamily: "inherit" }}
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Status
                    </label>
                    <select
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px]"
                      style={{ fontFamily: "inherit" }}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-[#D0D5DD] rounded-lg p-6 text-center hover:bg-[#F9FAFB] cursor-pointer transition-colors overflow-hidden"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#98A2B3"
                        strokeWidth="1.8"
                        className="mx-auto mb-2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                      <p className="text-[13px] font-medium text-[#344054]">
                        Upload product image
                      </p>
                      <p className="text-[11px] text-[#98A2B3] mt-0.5">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#EAECF0] flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-[#D0D5DD] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-[#F2F4F7]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-4 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005] flex items-center gap-2 disabled:opacity-70"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {editingProduct ? "Update product" : "Save product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;
