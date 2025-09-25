import { Button } from '@/components/ui/button';

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(totalPages, currentPage + 1))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};
