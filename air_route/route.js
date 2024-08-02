require('dotenv').config();
const express = require('express');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3001;

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'Route API',
    version: '1.0.0',
    description: 'API for getting route information'
  },
  servers: [
    {
      url: 'http://localhost:3001'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./route.js']
};

const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /route:
 *   post:
 *     summary: Get route information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *                 example: "Taipei 101"
 *               destination:
 *                 type: string
 *                 example: "Shipai MRT Station"
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 geocoded_waypoints:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       geocoder_status:
 *                         type: string
 *                         example: "OK"
 *                       place_id:
 *                         type: string
 *                         example: "ChIJH56c2rarQjQRphD9gvC8BhI"
 *                       types:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "premise"
 *                 routes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bounds:
 *                         type: object
 *                         properties:
 *                           northeast:
 *                             type: object
 *                             properties:
 *                               lat:
 *                                 type: number
 *                                 example: 25.0394099
 *                               lng:
 *                                 type: number
 *                                 example: 121.5637614
 *                           southwest:
 *                             type: object
 *                             properties:
 *                               lat:
 *                                 type: number
 *                                 example: 25.0332567
 *                               lng:
 *                                 type: number
 *                                 example: 121.5174187
 *                       copyrights:
 *                         type: string
 *                         example: "Map data ©2024 Google"
 *                       legs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             distance:
 *                               type: object
 *                               properties:
 *                                 text:
 *                                   type: string
 *                                   example: "10.3 km"
 *                                 value:
 *                                   type: integer
 *                                   example: 10300
 *                             duration:
 *                               type: object
 *                               properties:
 *                                 text:
 *                                   type: string
 *                                   example: "2 hours 30 mins"
 *                                 value:
 *                                   type: integer
 *                                   example: 9000
 *                             end_address:
 *                               type: string
 *                               example: "Shipai MRT Station, Taipei, Taiwan"
 *                             end_location:
 *                               type: object
 *                               properties:
 *                                 lat:
 *                                   type: number
 *                                   example: 25.1121951
 *                                 lng:
 *                                   type: number
 *                                   example: 121.5154465
 *                             start_address:
 *                               type: string
 *                               example: "Taipei 101, No. 7, Section 5, Xinyi Rd, Xinyi District, Taipei City, Taiwan 110"
 *                             start_location:
 *                               type: object
 *                               properties:
 *                                 lat:
 *                                   type: number
 *                                   example: 25.0333612
 *                                 lng:
 *                                   type: number
 *                                   example: 121.5637614
 *                             steps:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   distance:
 *                                     type: object
 *                                     properties:
 *                                       text:
 *                                         type: string
 *                                         example: "25 m"
 *                                       value:
 *                                         type: integer
 *                                         example: 25
 *                                   duration:
 *                                     type: object
 *                                     properties:
 *                                       text:
 *                                         type: string
 *                                         example: "1 min"
 *                                       value:
 *                                         type: integer
 *                                         example: 8
 *                                   end_location:
 *                                     type: object
 *                                     properties:
 *                                       lat:
 *                                         type: number
 *                                         example: 25.0332567
 *                                       lng:
 *                                         type: number
 *                                         example: 121.5635382
 *                                   html_instructions:
 *                                     type: string
 *                                     example: "Head <b>southwest</b> toward <b>市府路</b>"
 *                                   polyline:
 *                                     type: object
 *                                     properties:
 *                                       points:
 *                                         type: string
 *                                         example: "oixwCo|}dVRj@"
 *                                   start_location:
 *                                     type: object
 *                                     properties:
 *                                       lat:
 *                                         type: number
 *                                         example: 25.0333612
 *                                       lng:
 *                                         type: number
 *                                         example: 121.5637614
 *                                   travel_mode:
 *                                     type: string
 *                                     example: "WALKING"
 *                       overview_polyline:
 *                         type: object
 *                         properties:
 *                           points:
 *                             type: string
 *                             example: "oixwCo|}dVRj@W?[AiDCqHAA|BCbE{GCg@?@J?|@GR?|@EbEGxGErEKv@IzKSBIlGCdF?rHMzI?|@KFOLQ^EXAVBVH\\RLVf@J~@ClIIlNGh@CvFEd@GLEJm@vCEn@CtFFrDHFFPJd@Hn@AjCOz@]dA?JCbBAnD?nE^dCAvCJpAMlYEXA~BBrBInFAxA?nAGfBM~A[pDg@fHm@`JObDMbAQlBJf@CBCFKTCV?Db@BBRHLLFH@NALGHKBOd@N?C@GBM?KAKNMNMLU|@iCTq@L[p@f@"
 *                       summary:
 *                         type: string
 *                         example: "仁愛路四段"
 *                       warnings:
 *                         type: array
 *                         items:
 *                           type: string
 *                       waypoint_order:
 *                         type: array
 *                         items:
 *                           type: integer
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
app.post('/route', async (req, res) => {
    const { origin, destination } = req.body;

    // 預設出發地和目的地
    const defaultOrigin = "Taipei 101";
    const defaultDestination = "Shipai MRT Station";

    const finalOrigin = origin || defaultOrigin;
    const finalDestination = destination || defaultDestination;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: finalOrigin,
                destination: finalDestination,
                mode: 'WALKING',
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status !== 'OK') {
            return res.status(400).json({ error: 'Error fetching directions.', details: response.data });
        }

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});