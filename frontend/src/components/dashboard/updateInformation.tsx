import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import UserEntryData from "@/interfaces/userEntryData";
import { Dispatch, SetStateAction, useState } from "react";

const UpdateInformation = ({
  userEntryData,
  setUserEntryData,
}: {
  userEntryData: UserEntryData;
  setUserEntryData: Dispatch<SetStateAction<UserEntryData>>;
}) => {
  const [open, setOpen] = useState(false);

  const saveChanges = async () => {
    const response = fetch(
      process.env.NEXT_PUBLIC_API_URL + `/entries/${userEntryData.entryId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: localStorage.getItem("sessionToken"),
          franchiseName: userEntryData.franchiseName,
          name: userEntryData.entryName,
          length: userEntryData.entryLength,
          coverUrl: userEntryData.entryCoverUrl,
        }),
      },
    );

    toast.promise(response, {
      loading: "Loading...",
      success: () => {
        setOpen(false);
        return `Successfully saved changes for entry ${userEntryData.franchiseName}: ${userEntryData.entryName}`;
      },
      error: "Error",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <AlertTriangle className="h-[15px] w-[15px]" />
          Update incorrect information
        </Button>
      </DialogTrigger>
      <DialogContent>
        {userEntryData && (
          <>
            <DialogHeader>
              <DialogTrigger>
                Update {userEntryData.franchiseName}: {userEntryData.entryName}
              </DialogTrigger>
            </DialogHeader>
            <div className="flex flex-row gap-3">
              <div className="flex h-full w-full flex-col space-y-1.5">
                <Label htmlFor="name">Franchise Name</Label>
                <Input
                  value={userEntryData.franchiseName}
                  onChange={(e) =>
                    setUserEntryData({
                      ...userEntryData,
                      franchiseName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex h-full w-full flex-col space-y-1.5">
                <Label htmlFor="name">Entry Name</Label>
                <Input
                  value={userEntryData.entryName}
                  onChange={(e) =>
                    setUserEntryData({
                      ...userEntryData,
                      entryName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex h-full w-full flex-col space-y-1.5">
              <Label htmlFor="name">Length</Label>
              <Input
                type="number"
                value={userEntryData.entryLength}
                onChange={(e) =>
                  setUserEntryData({
                    ...userEntryData,
                    entryLength: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex h-full w-full flex-col space-y-1.5">
              <Label htmlFor="name">Cover Url</Label>
              <Input
                value={userEntryData.entryCoverUrl}
                onChange={(e) =>
                  setUserEntryData({
                    ...userEntryData,
                    entryCoverUrl: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={() => saveChanges()}>Save Changes</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateInformation;
