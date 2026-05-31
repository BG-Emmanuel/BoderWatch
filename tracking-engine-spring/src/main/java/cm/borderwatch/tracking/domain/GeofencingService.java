package cm.borderwatch.tracking.domain;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GeofencingService {
    private static final double R=6371.0;
    public static final List<Corridor> LEGAL_CORRIDORS=List.of(
        new Corridor("CORRIDOR_DOUALA_NDJAMENA","Douala–N'Djamena",25.0,List.of(
            new Waypoint(4.0511,9.7679,"Douala"),new Waypoint(4.9601,11.8616,"Yaoundé"),
            new Waypoint(5.9667,14.3167,"Ngaoundéré"),new Waypoint(7.3667,15.4833,"Garoua"),
            new Waypoint(12.1048,15.0445,"N'Djamena"))),
        new Corridor("CORRIDOR_DOUALA_BANGUI","Douala–Bangui",30.0,List.of(
            new Waypoint(4.0511,9.7679,"Douala"),new Waypoint(4.3612,18.5583,"Bangui")))
    );
    public GeofenceResult analyzePosition(double lat, double lon) {
        validate(lat,lon);
        double min=Double.MAX_VALUE; Corridor matched=null;
        for(Corridor c:LEGAL_CORRIDORS){
            var wps=c.waypoints();
            for(int i=0;i<wps.size()-1;i++){
                double d=seg(lat,lon,wps.get(i).lat(),wps.get(i).lon(),wps.get(i+1).lat(),wps.get(i+1).lon());
                if(d<min){min=d;if(d<=c.toleranceKm())matched=c;}
            }
        }
        double rounded=Math.round(min*10.0)/10.0;
        return matched!=null?new GeofenceResult("ON_ROUTE",matched.id(),rounded):new GeofenceResult("OFF_ROUTE",null,rounded);
    }
    public double haversineDistance(double lat1,double lon1,double lat2,double lon2){
        double dLat=Math.toRadians(lat2-lat1),dLon=Math.toRadians(lon2-lon1);
        double a=Math.pow(Math.sin(dLat/2),2)+Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))*Math.pow(Math.sin(dLon/2),2);
        return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    }
    double seg(double pLat,double pLon,double aLat,double aLon,double bLat,double bLon){
        double dL=bLat-aLat,dO=bLon-aLon;
        if(dL==0&&dO==0)return haversineDistance(pLat,pLon,aLat,aLon);
        double t=Math.max(0,Math.min(1,((pLat-aLat)*dL+(pLon-aLon)*dO)/(dL*dL+dO*dO)));
        return haversineDistance(pLat,pLon,aLat+t*dL,aLon+t*dO);
    }
    public String classifyViolationSeverity(double km){return km>100?"HIGH":km>25?"MEDIUM":"LOW";}
    private void validate(double lat,double lon){
        if(lat<-90||lat>90) throw new IllegalArgumentException("latitude out of range: "+lat);
        if(lon<-180||lon>180) throw new IllegalArgumentException("longitude out of range: "+lon);
    }
}
