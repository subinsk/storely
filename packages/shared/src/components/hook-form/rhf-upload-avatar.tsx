import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
// @mui
import FormHelperText from "@mui/material/FormHelperText";
//
import { Upload } from "../upload";

// ----------------------------------------------------------------------

type RHFUploadAvatarProps = {
  name: string;
  onDrop?: (files: File[]) => Promise<void>;
  children?: React.ReactNode;
};

export default function RHFUploadAvatar({ name, onDrop, children }: RHFUploadAvatarProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Upload
            accept={{ "image/*": [] }}
            file={field.value}
            error={!!error}
            onDrop={onDrop}
          >
            {children}
          </Upload>

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  children: PropTypes.node,
};
