import type { Map, MapMouseEvent, MapTouchEvent } from "maplibre-gl";
import type { Directions, MapLibreGlDirectionsConfiguration } from "./types";
import type { Feature, LineString, Point } from "geojson";
import { MapLibreGlDirectionsEvented, MapLibreGlDirectionsWaypointEvent } from "./events";
import { buildRequest, buildPoint, buildSnaplines, buildRoutelines, type RequestData } from "./utils";
/**
 * The main class responsible for all the user interaction and for the routing itself.
 */
export default class MapLibreGlDirections extends MapLibreGlDirectionsEvented {
    constructor(map: Map, configuration?: Partial<MapLibreGlDirectionsConfiguration>);
    protected readonly map: Map;
    protected readonly configuration: MapLibreGlDirectionsConfiguration;
    protected _interactive: boolean;
    protected _hoverable: boolean;
    protected buildRequest: typeof buildRequest;
    protected buildPoint: typeof buildPoint;
    protected buildSnaplines: typeof buildSnaplines;
    protected buildRoutelines: typeof buildRoutelines;
    protected onMoveHandler: (e: MapMouseEvent | MapTouchEvent) => void;
    protected onDragDownHandler: (e: MapMouseEvent | MapTouchEvent) => void;
    protected onDragMoveHandler: (e: MapMouseEvent | MapTouchEvent) => void;
    protected onDragUpHandler: (e: MapMouseEvent | MapTouchEvent) => void;
    protected onClickHandler: (e: MapMouseEvent | MapTouchEvent) => void;
    protected liveRefreshHandler: (e: MapMouseEvent | MapTouchEvent) => void;
    protected profiles: string[];
    protected _waypoints: Feature<Point>[];
    protected snappoints: Feature<Point>[];
    protected routelines: Feature<LineString>[][];
    protected selectedRouteIndex: number;
    protected hoverpoint: Feature<Point> | undefined;
    /**
     * @alias {@link waypoints}
     *
     * Aliased for the sakes of naming-consistency.
     */
    protected get waypointsCoordinates(): [number, number][];
    protected get snappointsCoordinates(): [number, number][];
    protected get snaplines(): Feature<LineString>[];
    protected init(): void;
    protected fetch({ method, url, payload }: RequestData): Promise<Directions>;
    protected fetchDirections(originalEvent: MapLibreGlDirectionsWaypointEvent): Promise<void>;
    protected draw(skipSelectedRouteRedraw?: boolean): void;
    protected highlightedWaypoints: Feature<Point>[];
    protected highlightedSnappoints: Feature<Point>[];
    protected deHighlight(): void;
    protected onMove(e: MapMouseEvent | MapTouchEvent): void;
    protected dragDownPosition: {
        x: number;
        y: number;
    };
    protected waypointBeingDragged?: Feature<Point>;
    protected waypointBeingDraggedInitialCoordinates?: [number, number];
    protected departSnappointIndex: number;
    protected currentMousePosition: {
        x: number;
        y: number;
    };
    protected onDragDown(e: MapMouseEvent | MapTouchEvent): void;
    protected refreshOnMoveIsRefreshing: boolean;
    protected onDragMove(e: MapMouseEvent | MapTouchEvent): void;
    protected noMouseMovementTimer?: ReturnType<typeof setTimeout>;
    protected onDragUp(e: MapMouseEvent | MapTouchEvent): Promise<void>;
    protected lastRequestMousePosition: {
        x: number;
        y: number;
    };
    protected liveRefresh(e: MapMouseEvent | MapTouchEvent): Promise<void>;
    protected onClick(e: MapMouseEvent | MapTouchEvent): void;
    protected assignWaypointsCategories(): void;
    protected _addWaypoint(waypoint: [number, number], index?: number, originalEvent?: MapMouseEvent | MapTouchEvent): Promise<void>;
    protected _removeWaypoint(index: number, originalEvent?: MapMouseEvent | MapTouchEvent): Promise<void>;
    /**
     * The interactivity state of the instance. When `true`, the user is allowed to interact with the features drawn on
     * the map and to add waypoints by clicking the map. Automatically set to `false` whenever there's an ongoing
     * routing request.
     */
    get interactive(): boolean;
    set interactive(interactive: boolean);
    /**
     * Allows hover effects in non-interactive mode. Can be set to `true` while `interactive` is `false` for the features
     * to be highlighted when hovered over by the user. Does nothing when `interactive` is `true`.
     */
    get hoverable(): boolean;
    set hoverable(hoverable: boolean);
    /**
     * Allows user to switch to alternative routes while in non-interactive mode. Only takes effect when `hoverable` is
     * `true`.
     */
    allowRouteSwitch: boolean;
    /**
     * Returns all the waypoints' coordinates in the order they appear.
     */
    get waypoints(): [number, number][];
    /**
     * @alias Synchronous analogue of {@link setWaypoints}.
     */
    set waypoints(waypoints: [number, number][]);
    /**
     * Returns all the waypoints' bearings values or an empty array if the `bearings` configuration option is not
     * enabled.
     */
    get waypointsBearings(): ([number, number] | undefined)[];
    /**
     * Sets the waypoints' bearings values. Does not produce any effect in case the `bearings` configuration option is
     * disabled.
     */
    set waypointsBearings(bearings: ([number, number] | undefined)[]);
    /**
     * Replaces all the waypoints with the specified ones and re-fetches the routes.
     *
     * @param waypoints The coordinates at which the waypoints should be added
     * @param profiles Profiles for fetching directions between waypoints.
     * @return Resolved after the routing request has finished
     */
    setWaypoints(waypoints: [number, number][], profiles?: string[]): Promise<void>;
    /**
     * Adds a waypoint at the specified coordinates to the map and re-fetches the routes.
     *
     * @param waypoint The coordinates at which the waypoint should be added
     * @param index The index the waypoint should be inserted at. If omitted, the waypoint is inserted at the end
     * @return Resolved after the routing request has finished
     */
    addWaypoint(waypoint: [number, number], index?: number): Promise<void>;
    /**
     * Removes a waypoint and its related snappoint by the waypoint's index from the map and re-fetches the routes.
     *
     * @param index The index of the waypoint to remove
     * @return Resolved after the routing request has finished
     */
    removeWaypoint(index: number): Promise<void>;
    /**
     * A publicly-available abort-controller that allows to manually abort an ongoing routing-request.
     *
     * Only exists (`!== undefined`) when there's an ongoing routing-request.
     *
     * @example
     * ```
     * direсtions.abortController.abort();
     * ```
     */
    abortController: AbortController | undefined;
    /**
     * Clears the map from all the instance's traces: waypoints, snappoints, routes, etc.
     */
    clear(): void;
    /**
     * Removes all the added `MapLibreGlDirections`-specific layers and sources. Must be called manually before
     * de-initializing the instance.
     */
    destroy(): void;
}
