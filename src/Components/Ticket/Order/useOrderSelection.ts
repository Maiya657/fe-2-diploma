import { useMemo, useState } from "react";
import type { CoachClassType, RouteSeatsResponseItem } from "../../../store/api/trainApi";
import {
  getClassOptions,
  getCoachDisplayLabel,
  getSelectedSeatInfos,
} from "./helpers";
import type {
  ExtraOptionKey,
  PassengerTicketType,
  SelectedExtraOptions,
  SelectedSeatAssignment,
} from "./types";

export const useOrderSelection = (coaches: RouteSeatsResponseItem[]) => {
  const classOptions = useMemo(() => getClassOptions(coaches), [coaches]);
  const [selectedClassType, setActiveClassType] = useState<CoachClassType | null>(null);
  const [selectedCoachId, setActiveCoachId] = useState<string | null>(null);
  const [activeTicketType, setActiveTicketType] = useState<PassengerTicketType>("adult");
  const [childWithoutSeatCount, setChildWithoutSeatCount] = useState(0);
  const [selectedSeatAssignments, setSelectedSeatAssignments] = useState<SelectedSeatAssignment[]>([]);
  const [selectedExtraOptionsByCoach, setSelectedExtraOptionsByCoach] = useState<Record<string, SelectedExtraOptions>>({});

  const activeClassOption = useMemo(
    () => classOptions.find(({ type }) => type === selectedClassType) ?? null,
    [selectedClassType, classOptions],
  );
  const activeClassType = activeClassOption ? selectedClassType : null;

  const activeCoachId = useMemo(() => {
    if (!activeClassOption?.coaches.length) {
      return null;
    }

    if (selectedCoachId && activeClassOption.coaches.some(({ coach }) => coach._id === selectedCoachId)) {
      return selectedCoachId;
    }

    return activeClassOption.coaches[0].coach._id;
  }, [activeClassOption, selectedCoachId]);

  const activeCoach = useMemo(
    () => activeClassOption?.coaches.find(({ coach }) => coach._id === activeCoachId) ?? null,
    [activeClassOption, activeCoachId],
  );

  const selectedSeatInfos = useMemo(
    () => getSelectedSeatInfos(coaches, selectedSeatAssignments),
    [coaches, selectedSeatAssignments],
  );

  const activeCoachSelectedSeats = activeCoach
    ? selectedSeatAssignments
      .filter(({ coachId }) => coachId === activeCoach.coach._id)
      .map(({ seatIndex }) => seatIndex)
    : [];
  const activeCoachExtraOptions = activeCoach
    ? selectedExtraOptionsByCoach[activeCoach.coach._id] ?? { linens: false, wifi: false }
    : { linens: false, wifi: false };
  const activeCoachLabel = useMemo(() => {
    if (!activeClassOption || !activeCoach) {
      return "";
    }

    const coachIndex = activeClassOption.coaches.findIndex(({ coach }) => coach._id === activeCoach.coach._id);

    return getCoachDisplayLabel(activeCoach.coach.name, Math.max(coachIndex, 0));
  }, [activeClassOption, activeCoach]);

  const handleSeatSelect = (seatIndex: number) => {
    if (!activeCoach) {
      return;
    }

    setSelectedSeatAssignments((currentState) => {
      const existingAssignment = currentState.find(
        (item) => item.coachId === activeCoach.coach._id && item.seatIndex === seatIndex,
      );

      if (existingAssignment && existingAssignment.ticketType !== activeTicketType) {
        return currentState;
      }

      if (existingAssignment) {
        return currentState.filter((item) => item !== existingAssignment);
      }

      return [
        ...currentState,
        {
          coachId: activeCoach.coach._id,
          seatIndex,
          ticketType: activeTicketType,
        },
      ];
    });
  };

  const handleExtraOptionToggle = (optionKey: ExtraOptionKey) => {
    if (!activeCoach) {
      return;
    }

    setSelectedExtraOptionsByCoach((currentState) => {
      const currentCoachOptions = currentState[activeCoach.coach._id] ?? {
        linens: false,
        wifi: false,
      };

      return {
        ...currentState,
        [activeCoach.coach._id]: {
          ...currentCoachOptions,
          [optionKey]: !currentCoachOptions[optionKey],
        },
      };
    });
  };

  return {
    activeClassOption,
    activeClassType,
    activeCoach,
    activeCoachExtraOptions,
    activeCoachLabel,
    activeCoachSelectedSeats,
    activeTicketType,
    childWithoutSeatCount,
    classOptions,
    handleSeatSelect,
    handleExtraOptionToggle,
    selectedSeatInfos,
    setActiveClassType,
    setActiveCoachId,
    setActiveTicketType,
    setChildWithoutSeatCount,
  };
};

export type OrderSelectionState = ReturnType<typeof useOrderSelection>;
