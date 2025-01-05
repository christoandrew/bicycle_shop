import { jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router";
export const ProductDetails = () => {
  const params = useParams();
  console.log(params);
  return _jsxs("div", { children: ["ProductDetails ", params.productId] });
};
