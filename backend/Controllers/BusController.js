import Operator from "../Models/OperatorModel.js";
import cloudinary from "../Config/Cloudinary.js";
import Bus from "../Models/BusModel.js";
import { Response } from "../utils/ResponseHandler.js";
import sharp from "sharp";
import { convertToMinutes } from "../utils/helper.js";

export const AddBus = async (req, res) => {
  try {
    const operatorId = req.operator;
    let {
      busname,
      drivername,
      busnumber,
      driverphonenumber,
      source,
      destination,
      bustype,
      seats,
      busRoutes,
      totalSeats,
      boardingPoints,
      droppingPoints,
      amenities,
      runDays,
    } = req.body;
    // console.log("req.body", req.body);
    // console.log("images", req.files);

    const files = req.files;

    // Safe JSON parse helper
    const safeParse = (data, fieldName) => {
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (err) {
          throw new Error(`Invalid JSON format in "${fieldName}"`);
        }
      }
      return data;
    };
    // Parse JSON fields safely
    bustype = safeParse(bustype, "bustype");
    seats = safeParse(seats, "seats");
    busRoutes = safeParse(busRoutes, "busRoutes");
    boardingPoints = safeParse(boardingPoints, "boardingPoints");
    droppingPoints = safeParse(droppingPoints, "droppingPoints");
    amenities = safeParse(amenities, "amenities");
    runDays = safeParse(runDays, "runDays");
    // Required field check
    if (
      !busname ||
      !drivername ||
      !busnumber ||
      !driverphonenumber ||
      !source ||
      !destination ||
      !bustype ||
      !totalSeats ||
      !boardingPoints ||
      !droppingPoints ||
      !amenities ||
      !seats ||
      !runDays
    ) {
      return Response(res, 403, "All fields is required");
    }

    if (!files || files.length === 0) {
      return Response(res, 400, "At least one image is required");
    }
    if (files.length > 6) {
      return Response(res, 400, "You can upload a maximum of 6 images");
    }
    // check operator exists or not
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 400, "Operator not found");
    }
    // Normalize busnumber for consistency
    busnumber = busnumber.trim().toUpperCase();
    // check same bus number already add with another bus
    const busexists = await Bus.findOne({ busnumber });
    if (busexists) {
      return Response(
        res,
        400,
        "This bus number is already registered with another bus."
      );
    }
    // Upload multiple images to cloudinary
    let imagesurl = [];
    for (const file of files) {
      // Size validation (<= 300 KB)
      if (file.size > 500 * 1024) {
        // 500 KB in bytes
        return Response(res, 400, "Image size should not exceed 300KB");
      }
      try {
        const optimizedImage = await sharp(file.buffer)
          .resize({ width: 500, height: 400 })
          .webp({ quality: 80 })
          .toBuffer();

        const imageBase64 = `data:image/webp;base64,${optimizedImage.toString(
          "base64"
        )}`;

        const cloudRes = await cloudinary.uploader.upload(imageBase64, {
          folder: "quickbus-bus-images",
          resource_type: "image",
        });

        imagesurl.push(cloudRes.secure_url);
      } catch (err) {
        console.log("Cloudinary upload error", err);
        return Response(res, 500, "Image upload failed");
      }
    }
    // Add departureMinutes
    if (boardingPoints && Array.isArray(boardingPoints)) {
      boardingPoints = boardingPoints.map((bp) => ({
        ...bp,
        departureMinutes: bp.departureTime
          ? convertToMinutes(bp.departureTime)
          : null,
      }));
    }
    // create bus
    const bus = await Bus.create({
      operatorId: operatorId,
      busname,
      drivername,
      busnumber,
      driverphonenumber,
      source,
      destination,
      bustype,
      seats,
      busRoutes,
      totalSeats,
      boardingPoints,
      droppingPoints,
      amenities,
      images: imagesurl,
    });
    // push bus id to operator mybuses array
    operator.mybuses.push(bus._id);
    await operator.save();
    return Response(res, 200, "Bus added successfully", bus);
  } catch (error) {
    console.log(error.response || error);
    console.log("failed to add bus", error);
    return Response(res, 500, "Internal server error");
  }
};

export const EachOperatorBuses = async (req, res) => {
  try {
    const operatorId = req.operator;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 400, "Operator not found");
    }
    // find operatorbuses
    const operatorbuses = await Bus.find({ operatorId: operatorId })
      .skip(skip)
      .limit(limit)
      .sort({ created: -1 })
      .lean();
    if (operatorbuses.length === 0) {
      return Response(res, 200, "No Buses found", {
        operatorbuses: [],
        pagination: { total: 0, currentPage: page, totalPages: 0 },
      });
    }
    const total = await Bus.countDocuments({ operatorId: operatorId });
    return Response(res, 200, "Operator Buses", {
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      operatorbuses,
    });
  } catch (error) {
    console.log("failed to find bus", error);
    return Response(res, 500, "Internal server error");
  }
};

export const EachBusDetails = async (req, res) => {
  try {
    const busId = req.params.id;
    const bus = await Bus.findById(busId).populate("operatorId", "companyName");
    if (!bus) {
      return Response(res, 400, "Bus Details not found");
    }
    return Response(res, 200, "Bus details found successfully", bus);
  } catch (error) {
    console.log("failed to find bus details", error);
    return Response(res, 500, "Internal server error");
  }
};

export const UpdateBusDetails = async (req, res) => {
  try {
    const operatorId = req.operator;
    const busId = req.params.id;
    let {
      busname,
      drivername,
      busnumber,
      driverphonenumber,
      source,
      destination,
      bustype,
      seats,
      busRoutes,
      totalSeats,
      boardingPoints,
      droppingPoints,
      amenities,
      deletedImages,
      runDays,
    } = req.body;
    // console.log("req.body",req.body)
    // console.log("images",req.files)
    // Get uploaded files (ensure it's an array)
    const files = Array.isArray(req.files)
      ? req.files
      : req.files
      ? [req.files]
      : [];
    // Safe JSON parse helper
    const safeParse = (data, fieldName) => {
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (err) {
          throw new Error(`Invalid JSON format in "${fieldName}"`);
        }
      }
      return data;
    };
    // Parse JSON fields safely is come as string
    bustype = safeParse(bustype, "bustype");
    seats = safeParse(seats, "seats");
    busRoutes = safeParse(busRoutes, "busRoutes");
    boardingPoints = safeParse(boardingPoints, "boardingPoints");
    droppingPoints = safeParse(droppingPoints, "droppingPoints");
    amenities = safeParse(amenities, "amenities");
    runDays = safeParse(runDays, "runDays");
    // check operator exists or not
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 400, "Operator not found");
    }
    // check bus exists or not
    const existingbus = await Bus.findById(busId);
    if (!existingbus) {
      return Response(res, 400, "Bus not found");
    }
    // ensure operator is updating only his own bus
    if (existingbus.operatorId.toString() !== operatorId) {
      return Response(res, 404, "You are not authorized to update this bus");
    }
    // deleted images list (coming from FE as JSON/string)
    if (typeof deletedImages === "string") {
      deletedImages = JSON.parse(deletedImages);
    }
    // start with existing bus images
    let imagesurl = existingbus.images;
    // remove deleted images (if any)
    if (deletedImages && deletedImages.length > 0) {
      imagesurl = imagesurl.filter((img) => !deletedImages.includes(img));
    }
    if (imagesurl.length + files.length > 6) {
      return Response(res, 400, "You can upload a maximum of 6 images");
    }
    // upload new files (if user added)
    if (files && files.length > 0) {
      for (const file of files) {
        // Size validation (<= 500 KB)
        if (file.size > 500 * 1024) {
          // 500 KB in bytes
          return Response(res, 400, "Image size should not exceed 500KB");
        }
        try {
          // optimize image with sharp (resize + convert to webp)
          const optimizedImage = await sharp(file.buffer)
            .resize({ width: 500, height: 400 })
            .webp({ quality: 80 })
            .toBuffer();

          // convert buffer → base64 (so cloudinary can accept it)
          const imageBase64 = `data:image/webp;base64,${optimizedImage.toString(
            "base64"
          )}`;
          // upload to cloudinary
          const cloudRes = await cloudinary.uploader.upload(imageBase64, {
            folder: "quickbus-bus-images",
            resource_type: "image",
          });
          imagesurl.push(cloudRes.secure_url);
        } catch (err) {
          console.log("Cloudinary upload error", err);
          return Response(res, 500, "Image upload failed");
        }
      }
    }
    // update bus
    // const updatedBus = await Bus.findByIdAndUpdate(busId,{
    //   busname,drivername,busnumber,driverphonenumber,source,destination,bustype,seats,busRoutes,totalSeats,boardingPoints,droppingPoints,amenities,
    //   images:imagesurl
    // },{new:true})
    // Update existing bus details (only overwrite fields if new data is provided)
    Object.assign(existingbus, {
      busname: busname ?? existingbus.busname,
      drivername: drivername ?? existingbus.drivername,
      busnumber: busnumber ?? existingbus.busnumber,
      driverphonenumber: driverphonenumber ?? existingbus.driverphonenumber,
      source: source ?? existingbus.source,
      destination: destination ?? existingbus.destination,
      bustype: bustype ?? existingbus.bustype,
      seats: seats ?? existingbus.seats,
      busRoutes: busRoutes ?? existingbus.busRoutes,
      totalSeats: totalSeats ?? existingbus.totalSeats,
      boardingPoints: boardingPoints ?? existingbus.boardingPoints,
      droppingPoints: droppingPoints ?? existingbus.droppingPoints,
      amenities: amenities ?? existingbus.amenities,
      images: imagesurl,
      runDays: runDays ?? existingbus.runDays,
    });
    // save final updated bus
    await existingbus.save();
    return Response(res, 200, "Bus Detail Updated Successfully", existingbus);
  } catch (error) {
    console.log("failed to update bus details", error);
    return Response(res, 500, "Internal server error");
  }
};

export const UpdateBusStatusActiveorNot = async (req, res) => {
  try {
    const operatorId = req.operator;
    const { isActive } = req.body;
    console.log("req.body", req.body);
    const busId = req.params.id;
    // Check operator exists
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 400, "Operator not found");
    }

    //  Fetch bus first to check ownership
    const bus = await Bus.findById(busId);
    if (!bus) {
      return Response(res, 400, "Bus not found");
    }
    // 3️ Check if operator owns this bus
    if (bus.operatorId.toString() !== operatorId) {
      return Response(res, 404, "You are not authorized to update this bus");
    }
    // Update bus status directly
    bus.isActive = isActive;
    await bus.save();
    return Response(res, 200, "Bus Status update successfully", bus);
  } catch (error) {
    console.log("failed to update bus status", error);
    return Response(res, 500, "Internal server error");
  }
};

export const DeleteBus = async (req, res) => {
  try {
    const operatorId = req.operator;
    const busId = req.params.id;
    // console.log("busid",busId)
    // Check operator exists
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 400, "Operator not found");
    }
    //  Fetch bus first to check ownership
    const bus = await Bus.findById(busId);
    if (!bus) {
      return Response(res, 400, "Bus not found");
    }
    // 2 Check if operator owns this bus
    if (bus.operatorId.toString() !== operatorId) {
      return Response(res, 404, "You are not authorized to delete this bus");
    }
    // Delete bus
    await Bus.findByIdAndDelete(busId);
    // remove bus from operator's array
    operator.mybuses.pull = bus._id;
    await operator.save();
    return Response(res, 200, "Bus deleted successfully");
  } catch (error) {
    console.log("failed to delete bus", error);
    return Response(res, 500, "Internal server error");
  }
};
/**
 * GetAllBuses Controller
 * ----------------------
 * Description:
 * This function fetches all available buses between two cities on a given date.
 * It supports filtering, pagination, and sorting by earliest departure.
 *
 * Work:
 * 1. Extract query parameters from request:
 *    - fromCityName: Boarding city (required)
 *    - toCityName: Dropping city (required)
 *    - date: Travel date (optional, defaults to today)
 *    - page & limit: For pagination (default page=1, limit=20)
 *    - amenities, airConditioning, category, layout: Optional filters
 *
 * 2. Calculate:
 *    - Current time in minutes (for filtering today's future buses)
 *    - Start and end of travel day
 *    - Day of the week (Mon, Tue, etc.) to match bus runDays
 *
 * 3. Prepare filters for bus amenities & bus type.
 *
 * 4. Use MongoDB Aggregation Pipeline:
 *    - Add boardingPoints and droppingPoints date based on travelDate
 *    - Adjust droppingPoints date if bus crosses midnight
 *    - Filter boarding and dropping points by city, date, and time
 *    - Match buses that run on selected day and satisfy filters
 *    - Add earliestDeparture for sorting
 *    - Apply pagination and count total buses
 *
 * 5. Prepare final response with:
 *    - List of buses with updated boarding/dropping points
 *    - Pagination info: total buses, total pages, current page, limit
 *
 * Notes:
 * - Midnight crossing is handled: if dropping time < boarding time, dropping date is incremented by 1 day.
 * - Debug fields can be enabled for UTC/IST times during development.
 * - Returns 400 if required cities are missing, 500 on internal errors.
 */
export const GetAllBuses = async (req, res) => {
  try {
    const {
      fromCityName,
      toCityName,
      date,
      page = 1,
      limit = 20,
      amenities,
      airConditioning,
      category,
      layout,
    } = req.query;
    // console.log("Query Params:", req.query);
    // Check required query params
    if (!fromCityName || !toCityName)
      return Response(res, 400, "From & To city required");

    // Pagination setup
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Current time and travel date
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    // Use selected date or today
    const travelDate = date ? new Date(new Date(date).toISOString()) : now;
    // console.log("Travel Date Corrected:", travelDate.toISOString());
    const startOfDay = new Date(travelDate);
    startOfDay.setHours(0, 0, 0, 0); // Start of travel date

    const endOfDay = new Date(travelDate);
    endOfDay.setHours(23, 59, 59, 999); // End of travel date

    // Current day of week, e.g., "Mon"
    const dayOfWeek = travelDate.toLocaleString("en-US", { weekday: "short" });
    // console.log("Day of Week:", dayOfWeek);

    // Prepare filters for amenities & bustype (supports multiple selection)
    const filters = {isActive:"Active"};
    if (amenities)
      filters.amenities = { $in: amenities.split(",").map((a) => a.trim()) };
    if (airConditioning)
      filters["bustype.airConditioning"] = {
        $in: airConditioning.split(",").map((a) => a.trim()),
      };
    if (category)
      filters["bustype.category"] = {
        $in: category.split(",").map((a) => a.trim()),
      };
    if (layout)
      filters["bustype.layout"] = {
        $in: layout.split(",").map((a) => a.trim()),
      };
    // MongoDB aggregation pipeline
    const result = await Bus.aggregate([
      // Lookup operator collection
      {
        $lookup: {
          from: "operators",
          localField: "operatorId",
          foreignField: "_id",
          as: "operatorInfo",
        },
      },
      {
        $addFields: {
          companyName: { $arrayElemAt: ["$operatorInfo.companyName", 0] },
        },
      },
      {
        $project: {
          operatorInfo: 0, // remove operator object
        },
      },
      {
        $addFields: {
          boardingPoints: {
            $map: {
              input: "$boardingPoints",
              as: "bp",
              in: { $mergeObjects: ["$$bp", { date: travelDate }] },
            },
          },
          droppingPoints: {
            $map: {
              input: "$droppingPoints",
              as: "dp",
              in: {
                $mergeObjects: [
                  "$$dp",
                  {
                    date: {
                      $cond: [
                        {
                          $lt: [
                            { $toInt: { $substr: ["$$dp.time", 0, 2] } }, // drop hour
                            {
                              $toInt: {
                                $substr: [
                                  {
                                    $arrayElemAt: [
                                      "$boardingPoints.departureTime",
                                      0,
                                    ],
                                  },
                                  0,
                                  2,
                                ],
                              },
                            }, // departure hour
                          ],
                        },
                        { $add: [travelDate, 1000 * 60 * 60 * 24] }, // next day
                        travelDate,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          boardingPoints: {
            $filter: {
              input: "$boardingPoints",
              as: "bp",
              cond: {
                $and: [
                  {
                    $eq: [
                      { $toLower: "$$bp.city" },
                      fromCityName.toLowerCase(),
                    ],
                  }, // City match
                  { $gte: ["$$bp.date", startOfDay] }, // After start of day
                  { $lte: ["$$bp.date", endOfDay] }, // Before end of day
                  ...(!date || travelDate.toDateString() === now.toDateString()
                    ? [{ $gte: ["$$bp.departureMinutes", nowMinutes] }] // Only future buses today
                    : []),
                ],
              },
            },
          },
          droppingPoints: {
            $filter: {
              input: "$droppingPoints",
              as: "dp",
              cond: {
                $eq: [{ $toLower: "$$dp.city" }, toCityName.toLowerCase()],
              },
            },
          },
        },
      },

      // Debug logs
      // {
      //   $addFields: {
      //     debugBoardingUTC: "$boardingPoints.date",
      //     debugBoardingIST: {
      //       $map: {
      //         input: "$boardingPoints",
      //         as: "bp",
      //         in: {
      //           $dateToString: { date: "$$bp.date", timezone: "Asia/Kolkata", format: "%Y-%m-%d %H:%M:%S" }
      //         }
      //       }
      //     },
      //     debugDroppingUTC: "$droppingPoints.date",
      //     debugDroppingIST: {
      //       $map: {
      //         input: "$droppingPoints",
      //         as: "dp",
      //         in: {
      //           $dateToString: { date: "$$dp.date", timezone: "Asia/Kolkata", format: "%Y-%m-%d %H:%M:%S" }
      //         }
      //       }
      //     }
      //   }
      // },
      // Keep only buses with at least 1 boarding & 1 dropping point + optional filters
      {
        $match: {
          "boardingPoints.0": { $exists: true },
          "droppingPoints.0": { $exists: true },
          runDays: { $in: [dayOfWeek] },
          ...filters,
        },
      },
      // Pagination + earliest departure sorting
      {
        $facet: {
          paginatedResults: [
            {
              $addFields: {
                earliestDeparture: { $min: "$boardingPoints.departureMinutes" },
              },
            },
            { $sort: { earliestDeparture: 1 } }, // Sort by earliest departure
            { $skip: skip },
            { $limit: limitNumber },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    //  console.log("Aggregation Result:", JSON.stringify(result, null, 2));

    // Prepare final response
    const buses = result[0].paginatedResults;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return Response(res, 200, "Buses found", {
      buses,
      pagination: {
        totalBuses: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (err) {
    console.log("Failed to get buses:", err);
    return Response(res, 500, "Internal server error")
  }
};

export const FindActiveRoutes = async (req, res) => {
  try {
    const operatorId = req.operator;
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 404, "Operator not found");
    }
    // get all buses of operator
    const buses = await Bus.find({ operatorId: operatorId });
    if (!buses || buses.length === 0) {
      return Response(res, 404, "No buses found");
    }

    const routesMap = new Map();
    buses.forEach((bus) => {
      const route = `${bus.source}-${bus.destination}`;
      if (routesMap.has(route)) {
        routesMap.set(route, routesMap.get(route) + 1);
      } else {
        routesMap.set(route, 1);
      }
    });
    const activeRouteCount = routesMap.size;
    const routeDetails = Array.from(routesMap, ([route, buses]) => ({
      route,
      buses,
    }));
    return Response(res, 200, "Active Routes", {
      activeRouteCount,
      routeDetails,
    });
  } catch (error) {
    console.log("failed to active routes", error);
    return Response(res, 500, "Internal Server error");
  }
};
