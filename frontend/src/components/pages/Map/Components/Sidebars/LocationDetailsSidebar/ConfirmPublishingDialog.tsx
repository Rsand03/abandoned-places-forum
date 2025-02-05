import { useState } from "react";
import emitter from "../../../../../../emitter/eventEmitter";
import { Button } from "../../../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../ui/dialog";
import { Input } from "../../../../../ui/input";
import { Label } from "../../../../../ui/label";
import { MapLocation } from "../../utils";

const API_URL = import.meta.env.VITE_API_URL;

interface ConfirmPublishingDialogProps {
  globalSelectedLocation: MapLocation;
  stopDisplayingLocation: (deletedLocationId: string) => void;
  displayModifiedLocation: (
      createdLocation: MapLocation,
      selectOnMap: boolean
  ) => void;
}

export default function ConfirmPublishingDialog({ globalSelectedLocation, stopDisplayingLocation, displayModifiedLocation }: ConfirmPublishingDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [points, setPoints] = useState<number>(0);

  const publishLocation = async (locationId: string, minRequiredPointsToView: number) => {
    try {
      emitter.emit("startLoading");

      const userToken = localStorage.getItem("userToken");

      if (!userToken || !locationId || minRequiredPointsToView === undefined) {
        console.error("Missing required data for publishing location");
        return;
      }

      const response = await fetch(`${API_URL}/api/locations/publish`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId,
          minRequiredPointsToView
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish location");
      }

      const publishedLocation = await response.json();

      stopDisplayingLocation(publishedLocation.id);
      displayModifiedLocation(publishedLocation, true);

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error publishing location:", error);
    } finally {
      emitter.emit("refreshLocationList");
      emitter.emit("stopLoading");
    }
  };

  return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Avalikusta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Points</DialogTitle>
          <DialogDescription>
            Insert the number of points required for other users to see your Public Location.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="text-right">
              Points
            </Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPoints(value >= 0 ? value : 0);
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            type="submit"
            onClick={() => {
              if (points >= 0) {
                publishLocation(globalSelectedLocation.id, points);
              } else {
                console.error("Points cannot be negative");
              }
            }}
          >
            Publish Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
