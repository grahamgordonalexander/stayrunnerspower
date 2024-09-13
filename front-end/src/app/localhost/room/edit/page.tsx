"use client";

import { useState, useEffect, Suspense } from "react";
import axios, { AxiosResponse } from "axios";
import { useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isEmpty, isValidPrice } from "@/utils/validation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config/const";

interface City {
  _id: string;
  city_name: string;
}

interface Payment_Option {
  label: string;
  value: string;
}

const EditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const room_id = searchParams.get("room_id") || "";
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList>();

  const [loading, setLoading] = useState(false);

  const [roomData, setRoomData] = useState({
    min_price_per_night: "",
    payment_option: "",
    pic_urls: [],
    city: "",
    room_Amentities: "",
    description: "",
  });

  const [dataErrors, setDataErrors] = useState({
    min_price_per_night: "",
    payment_option: "",
    city: "",
    room_Amentities: "",
    description: "",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<Payment_Option[]>([]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(images);
    setDataErrors(() => {
      return {
        min_price_per_night: "",
        payment_option: "",
        city: "",
        room_Amentities: "",
        description: "",
      };
    });

    if (isEmpty(roomData?.min_price_per_night)) {
      toast.error("Please enter a valid price");
      setDataErrors({
        ...dataErrors,
        min_price_per_night: "Please enter a valid price",
      });
    } else if (isEmpty(roomData?.payment_option)) {
      toast.error("Please select a valid payment option");
      setDataErrors({
        ...dataErrors,
        payment_option: "Please select a valid payment option",
      });
    } else if (isEmpty(roomData?.city)) {
      toast.error("Please select a valid city");
      setDataErrors({
        ...dataErrors,
        city: "Please select a valid city",
      });
    } else if (isEmpty(roomData?.room_Amentities)) {
      toast.error("Please enter a valid room_Amentities");
      setDataErrors({
        ...dataErrors,
        room_Amentities: "Please enter a valid room_Amentities",
      });
    } else if (isEmpty(roomData?.description)) {
      toast.error("Please enter a valid description of room");
      setDataErrors({
        ...dataErrors,
        description: "Please enter a valid description of room",
      });
    } else {
      var formData = new FormData();
      formData.append("min_price_per_night", roomData.min_price_per_night);
      formData.append("payment_option", roomData.payment_option);
      formData.append("city", roomData.city);
      formData.append("room_Amentities", roomData.room_Amentities);
      formData.append("description", roomData.description);
      if (imageFiles) {
        Array.from(imageFiles).forEach((image) => {
          formData.append("images", image);
        });
      }

      try {
        setLoading(true);
        const res: AxiosResponse = await axios.patch(
          `${baseUrl}/rooms/${room_id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (res.status === 200) {
          toast.success("Room has been updated successfully");
          router.push("/localhost/home");
        }
      } catch (err: any) {
        const errMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message[0]
          : err.response.data.message;
        toast.success(errMsg);
        setLoading(false);
      }
    }

    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "min_price_per_night" && !isValidPrice(value) && value !== "")
      return;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageFiles(files);
      setImages((prevImages) => prevImages.concat(fileArray));
      Array.from(files).map((file) => URL.revokeObjectURL(file.toString()));
    }
  };

  const getAllCities = async () => {
    const res = await axios.get(baseUrl+"/cities");
    if (res?.data?.data) {
      setCities(res.data.data);
    }
  };

  const getRoom = async (room_id: string) => {
    const res = await axios.get(
      `${baseUrl}/localhosts/room/${room_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    console.log(res);
    if (res?.data?.data) {
      setRoomData(res.data.data);
    }
  };

  useEffect(() => {
    getAllCities();
    setPaymentOptions([
      {
        label: "Cash",
        value: "Cash",
      },
      {
        label: "Credit Card",
        value: "Credit Card",
      },
    ]);
    getRoom(room_id);
  }, []);

  return (
    <div className="bg-slate-50 grainy-light">
      <MaxWidthWrapper>
        <div className="w-full flex justify-center py-4">
          <div className="w-full md:max-w-xl col-span-full lg:col-span-1 flex flex-col bg-white shadow-md rounded-md">
            <form onSubmit={onSubmit}>
              <div className="px-8 pb-12 pt-12">
                <h2 className="tracking-tight font-bold text-3xl">Edit Room</h2>

                <div className="w-full h-px bg-zinc-200 my-6" />

                <div className="relative mt-4 h-full flex flex-col justify-between">
                  <div className="flex flex-col gap-6">
                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${
                          dataErrors?.min_price_per_night && "text-red-600"
                        }`}
                      >
                        Min Price per Night
                      </Label>
                      <Input
                        name="min_price_per_night"
                        className={`${
                          dataErrors?.min_price_per_night && "border-red-600"
                        }`}
                        type="number"
                        value={roomData?.min_price_per_night}
                        onChange={handleChange}
                      />
                      {dataErrors?.min_price_per_night && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.min_price_per_night}
                        </p>
                      )}
                    </div>

                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${
                          dataErrors?.payment_option && "text-red-600"
                        }`}
                      >
                        Payment Option
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {paymentOptions?.length > 0
                              ? (() => {
                                  const matched = paymentOptions.find(
                                    (item) =>
                                      item.value === roomData.payment_option
                                  );
                                  return matched
                                    ? matched.label
                                    : "Select Payment Option";
                                })()
                              : "Select Payment Option"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {paymentOptions?.length > 0 &&
                            paymentOptions.map((item) => (
                              <DropdownMenuItem
                                key={item.value}
                                className={cn(
                                  "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                                  {
                                    "bg-zinc-100":
                                      item.value === roomData.payment_option,
                                  }
                                )}
                                onClick={() => {
                                  setRoomData((prev) => ({
                                    ...prev,
                                    payment_option: item.value,
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    item.value === roomData.payment_option
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {item.label}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {dataErrors?.payment_option && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.payment_option}
                        </p>
                      )}
                    </div>

                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${dataErrors?.city && "text-red-600"}`}
                      >
                        City
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {cities?.length > 0
                              ? (() => {
                                  const matchedCity = cities.find(
                                    (item) => item._id === roomData.city
                                  );
                                  return matchedCity
                                    ? matchedCity.city_name
                                    : "Select City";
                                })()
                              : "Select City"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {cities?.length > 0 &&
                            cities.map((city) => (
                              <DropdownMenuItem
                                key={city._id}
                                className={cn(
                                  "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                                  {
                                    "bg-zinc-100": city._id === roomData.city,
                                  }
                                )}
                                onClick={() => {
                                  setRoomData((prev) => ({
                                    ...prev,
                                    city: city._id,
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    city._id === roomData.city
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {city.city_name}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {dataErrors?.city && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.city}
                        </p>
                      )}
                    </div>

                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${dataErrors?.room_Amentities && "text-red-600"}`}
                      >
                    Room Service
                      </Label>
                      <Input
                        name="room_Amentities"
                        className={`${dataErrors?.room_Amentities && "border-red-600"}`}
                        type="text"
                        value={roomData?.room_Amentities}
                        onChange={handleChange}
                        placeholder="24/7"
                      />
                      {dataErrors?.room_Amentities && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.room_Amentities}
                        </p>
                      )}
                    </div>

                    <div className="relative flex flex-col gap-1 w-full">
                      <Label
                        className={`${
                          dataErrors?.description && "text-red-600"
                        }`}
                      >
                        Description of Room
                      </Label>
                      <Input
                        name="description"
                        className={`${
                          dataErrors?.description && "border-red-600"
                        }`}
                        type="text"
                        value={roomData?.description}
                        onChange={handleChange}
                      />
                      {dataErrors?.description && (
                        <p className="text-red-600 text-xs italic">
                          {dataErrors?.description}
                        </p>
                      )}
                    </div>

                    <div className="relative flex flex-col gap-1 w-full">
                      <div>
                        <Label>Upload Pictures</Label>
                        <Input
                          id="pictures"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </div>

                      <div className="image-preview image-container">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Uploaded Preview ${index + 1}`}
                          />
                        ))}
                        {images?.length < 1 &&
                          roomData?.pic_urls?.length > 0 &&
                          roomData?.pic_urls?.map((item, index) => (
                            <img
                              key={index}
                              src={`${baseUrl}/uploads/${item}`}
                              alt={`Uploaded Preview ${index + 1}`}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-8 bg-white pb-12 rounded-md">
                <div className="w-full h-full flex justify-end items-center">
                  <div className="w-full flex justify-center gap-6 items-center">
                    <Button
                      disabled={loading}
                      type="submit"
                      size="sm"
                      className="text-sm px-10"
                    >
                      {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Link href={"/localhost/home"}>
                      <Button
                        size="sm"
                        className="text-sm px-10 bg-gray-400 hover:bg-red-600"
                      >
                        cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditPage />
  </Suspense>
);

export default Page;
