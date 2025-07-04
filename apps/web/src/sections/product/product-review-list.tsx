import PropTypes from "prop-types";
// @mui
import Pagination, { paginationClasses } from "@mui/material/Pagination";
//
import ProductReviewItem from "./product-review-item";

// ----------------------------------------------------------------------

export default function ProductReviewList({ reviews }: { reviews: any }) {
  return (
    <>
      {reviews.map((review: any) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
        sx={{
          mx: "auto",
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: "auto",
            justifyContent: "center",
          },
        }}
      />
    </>
  );
}

ProductReviewList.propTypes = {
  reviews: PropTypes.array,
};
