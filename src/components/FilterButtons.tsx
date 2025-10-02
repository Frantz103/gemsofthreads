import { Button } from "@/components/ui/button";

interface FilterButtonsProps {
  activeFilter: "all" | "text" | "images";
  onFilterChange: (filter: "all" | "text" | "images") => void;
}

const FilterButtons = ({ activeFilter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
        className="transition-all duration-200"
      >
        All
      </Button>
      <Button
        variant={activeFilter === "text" ? "default" : "outline"}
        onClick={() => onFilterChange("text")}
        className="transition-all duration-200"
      >
        Text
      </Button>
      <Button
        variant={activeFilter === "images" ? "default" : "outline"}
        onClick={() => onFilterChange("images")}
        className="transition-all duration-200"
      >
        Images
      </Button>
    </div>
  );
};

export default FilterButtons;
