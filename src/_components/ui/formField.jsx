import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const Formfield = ({
  name,
  control,
  label,
  type,
  description,
  placeholder,
  required,
  className,
  value,
  disabled,
  onChange,
  labelStyle,
  multiple,
}) => {
  return (
    <FormField
      required={required}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelStyle}>{label}</FormLabel>
          <FormControl>
            {type === "file" ? (
              <Input
                value={value}
                type={type}
                multiple={multiple}
                placeholder={placeholder}
                {...field}
                disabled={disabled}
                onChange={onChange}
              />
            ) : (
              <Input
                value={value}
                type={type}
                placeholder={placeholder}
                {...field}
                disabled={disabled}
              />
            )}
          </FormControl>
          <FormMessage />
          <FormDescription>{description}</FormDescription>
        </FormItem>
      )}
    />
  );
};

export default Formfield;
