import PropTypes from "prop-types";
// components
import Markdown from "@storely/shared/components/markdown";

// ----------------------------------------------------------------------

export default function ProductDetailsDescription({
  description,
}: {
  description: any;
}) {
  return (
    <Markdown
      children={description}
      sx={{
        p: 3,
        "& p, li, ol": {
          typography: "body2",
        },
        "& ol": {
          p: 0,
          display: { md: "flex" },
          listStyleType: "none",
          "& li": {
            "&:first-of-type": {
              minWidth: 240,
              mb: { xs: 0.5, md: 0 },
            },
          },
        },
      }}
    />
  );
}

ProductDetailsDescription.propTypes = {
  description: PropTypes.string,
};
