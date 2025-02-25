import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  FaPhone,
  FaPhoneSlash,
} from "react-icons/fa";
import axios from "axios";
import "./call.css";

const keypadNumbers = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "*",
  "0",
  "#",
];

const Call: React.FC = () => {
  const [phoneNumber, setPhoneNumber] =
    useState<string>("");
  const [
    activeCallSid,
    setActiveCallSid,
  ] = useState<string | null>(null);
  const [
    callConnection,
    setCallConnection,
  ] = useState<boolean>(false);
  const inputRef =
    useRef<HTMLInputElement>(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle changes to the input field (e.g., typing manually or deleting)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    // Allow only numbers and * or #
    const filteredValue =
      newValue.replace(/[^0-9*#]/g, "");
    setPhoneNumber(filteredValue);
  };

  // Handle keypad button click
  const handleButtonClick = useCallback(
    (value: string) => {
      setPhoneNumber(
        (prev) => prev + value,
      );
    },
    [],
  );

  // Handle keydown event for backspace
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent,
    ) => {
      if (
        e.key === "Backspace" &&
        inputRef.current
      ) {
        const start =
          inputRef.current
            .selectionStart || 0;
        const end =
          inputRef.current
            .selectionEnd || 0;
        if (start !== end) {
          setPhoneNumber(
            (prev) =>
              prev.slice(0, start) +
              prev.slice(end),
          );
        } else {
          setPhoneNumber((prev) =>
            prev.slice(0, -1),
          );
        }
      }
    };
    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  // Call action (validate phone number before proceeding)
  const handleCall = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/call",
        {
          phoneNumber,
        },
      );

      if (response.data.success) {
        setActiveCallSid(
          response.data.callSid,
        );
        setCallConnection(true);
      }
    } catch (e: any) {
      console.log(e.message);
      setCallConnection(false);
    }
  };

  const handleHangUp = async () => {
    if (activeCallSid) {
      try {
        const response =
          await axios.post(
            "http://localhost:5000/hangup",
            {
              callSid: activeCallSid, // Pass the stored CallSid
            },
          );

        if (response.data.success) {
          setCallConnection(false);
        }
      } catch (e: any) {
        console.log(e.message);
        setCallConnection(false);
      }
    } else {
      console.log(
        "No active call to hang up",
      );
    }
  };

  return (
    <div className='call-container'>
      <img
        src='./logo.jpg'
        className='logo'
        alt='Logo'
      />
      <input
        type='tel'
        ref={inputRef}
        name='phoneNumber'
        value={phoneNumber}
        className='phone-input'
        placeholder='Enter number'
        onChange={handleInputChange}
        inputMode='numeric'
        aria-label='Phone number input'
      />
      <div className='keypad-grid'>
        {keypadNumbers.map((value) => (
          <button
            key={value}
            className='keypad-button'
            onClick={() =>
              handleButtonClick(value)
            }
            aria-label={`Press ${value}`}>
            {value}
          </button>
        ))}
      </div>
      {callConnection ? (
        <button
          className='call-button-hangup'
          onClick={handleHangUp}>
          <FaPhone />
        </button>
      ) : (
        <button
          className='call-button'
          onClick={handleCall}>
          <FaPhone />
        </button>
      )}
    </div>
  );
};

export default Call;
