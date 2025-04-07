import { Phone, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface HelpSectionProps {
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
}

const HelpSection: React.FC<HelpSectionProps> = ({
  isHelpModalOpen,
  setIsHelpModalOpen,
}) => {
  return (
    <>
      <div className="mt-8 flex justify-end">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsHelpModalOpen(true)}
        >
          <HelpCircle size={24} className="text-primary" />
          <span>Hỗ trợ khách hàng</span>
        </Button>
      </div>

      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              Hỗ trợ khách hàng
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 my-4">
            <div className="flex items-center gap-3 mb-2">
              <Phone size={24} className="text-primary" />
              <span className="text-gray-600">Điện thoại: 0867-435-157</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={24} className="text-primary" />
              <span className="text-gray-600">Email: workhive.vn.official@gmail.com</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHelpModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpSection;
