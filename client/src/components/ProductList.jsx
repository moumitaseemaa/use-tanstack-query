import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


const retriveProducts = async ({ queryKey }) => {

    const response = await axios.get(
        `http://localhost:3000/products?_page=${queryKey[1].page}&_per_page=6`
    );
    return response.data;

};

const ProductList = () => {
    const [page, setPage] = useState(1);

    const { data: products, error, isLoading } = useQuery({
        queryKey: ["products", { page }],
        queryFn: retriveProducts,
        retry: false,

    });

    if (isLoading) return <div className="text-center mt-10">Loading Products...</div>;
    if (error) return <div className="text-red-500 text-center">An Error occurred: {error.message}</div>;

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <h2 className="text-3xl my-4 font-bold">Product List</h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {products && products.data && products.data.map((product) => (
                    <li
                        key={product.id}
                        className="flex flex-col items-center border rounded-lg shadow-sm overflow-hidden bg-white"
                    >
                        <img
                            className="object-cover h-48 w-full"
                            src={product.thumbnail}
                            alt={product.title}
                        />
                        <div className="p-4 text-center">
                            <p className="text-xl font-semibold">{product.title}</p>
                            <p className="text-gray-600">USD {product.price}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex mt-6 mb-10">
                <button
                    disabled={!products?.prev}
                    className={`p-2 mx-2 border rounded-md ${!products?.prev ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white cursor-pointer"
                        }`}
                    onClick={() => setPage(products.prev)}
                >
                    Previous
                </button>

                <span className="flex items-center mx-4 font-semibold text-lg">
                    Page {page} of {products?.pages}
                </span>

                <button
                    disabled={!products?.next}
                    className={`p-2 mx-2 border rounded-md ${!products?.next ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white cursor-pointer"
                        }`}
                    onClick={() => setPage(products.next)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;