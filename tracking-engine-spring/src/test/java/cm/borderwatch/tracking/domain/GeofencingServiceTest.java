package cm.borderwatch.tracking.domain;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.*;

@DisplayName("GeofencingService Tests")
class GeofencingServiceTest {
    GeofencingService svc;
    @BeforeEach void up(){ svc=new GeofencingService(); }

    @Test void tc101_samePointZero(){ assertThat(svc.haversineDistance(4,9,4,9)).isEqualTo(0.0); }
    @Test void tc102_doualaToYaounde(){ assertThat(svc.haversineDistance(4.0511,9.7679,4.9601,11.8616)).isBetween(240.0,260.0); }
    @Test void tc103_symmetric(){ assertThat(svc.haversineDistance(4,9,5,10)).isCloseTo(svc.haversineDistance(5,10,4,9),within(0.001)); }
    @Test void tc104_equatorial1deg(){ assertThat(svc.haversineDistance(0,0,0,1)).isCloseTo(111.2,within(0.5)); }
    @Test void tc105_positive(){ assertThat(svc.haversineDistance(0,0,1,1)).isGreaterThan(0); }
    @Test void tc114_doualaOnRoute(){ var r=svc.analyzePosition(4.0511,9.7679); assertThat(r.status()).isEqualTo("ON_ROUTE"); assertThat(r.corridorId()).isEqualTo("CORRIDOR_DOUALA_NDJAMENA"); }
    @Test void tc115_yaoundeOnRoute(){ assertThat(svc.analyzePosition(4.9601,11.8616).status()).isEqualTo("ON_ROUTE"); }
    @Test void tc116_ngaoundereOnRoute(){ assertThat(svc.analyzePosition(5.9667,14.3167).status()).isEqualTo("ON_ROUTE"); }
    @Test void tc117_ndjamenaOnRoute(){ assertThat(svc.analyzePosition(12.1048,15.0445).status()).isEqualTo("ON_ROUTE"); }
    @Test void tc121_librevilleOffRoute(){ var r=svc.analyzePosition(0.4162,9.4673); assertThat(r.status()).isEqualTo("OFF_ROUTE"); assertThat(r.corridorId()).isNull(); assertThat(r.minDistanceKm()).isGreaterThan(100); }
    @Test void tc122_minDistPositive(){ assertThat(svc.analyzePosition(0,0).minDistanceKm()).isGreaterThan(0); }
    @Test void tc123_minDistRounded(){ double km=svc.analyzePosition(0.4162,9.4673).minDistanceKm(); assertThat(km).isEqualTo(Math.round(km*10.0)/10.0); }
    @Test void tc130_lat91throws(){ assertThatThrownBy(()->svc.analyzePosition(91,9)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc131_lat_91throws(){ assertThatThrownBy(()->svc.analyzePosition(-91,9)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc132_lon181throws(){ assertThatThrownBy(()->svc.analyzePosition(4,181)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc133_lat90valid(){ assertThatNoException().isThrownBy(()->svc.analyzePosition(90,0)); }
    @Test void tc134_lon_180valid(){ assertThatNoException().isThrownBy(()->svc.analyzePosition(0,-180)); }
    @Test void tc135_0kmLow(){ assertThat(svc.classifyViolationSeverity(0)).isEqualTo("LOW"); }
    @Test void tc136_25kmLow(){ assertThat(svc.classifyViolationSeverity(25)).isEqualTo("LOW"); }
    @Test void tc137_25_1kmMedium(){ assertThat(svc.classifyViolationSeverity(25.1)).isEqualTo("MEDIUM"); }
    @Test void tc138_100kmMedium(){ assertThat(svc.classifyViolationSeverity(100)).isEqualTo("MEDIUM"); }
    @Test void tc139_100_1kmHigh(){ assertThat(svc.classifyViolationSeverity(100.1)).isEqualTo("HIGH"); }
    @Test void tc140_500kmHigh(){ assertThat(svc.classifyViolationSeverity(500)).isEqualTo("HIGH"); }
    @Test void tc141_twoCorridors(){ assertThat(GeofencingService.LEGAL_CORRIDORS).hasSize(2); }
    @Test void tc142_validWaypointCoords(){ GeofencingService.LEGAL_CORRIDORS.forEach(c->c.waypoints().forEach(w->{ assertThat(w.lat()).isBetween(-90.0,90.0); assertThat(w.lon()).isBetween(-180.0,180.0); })); }
    @ParameterizedTest(name="TC-143 {0},{1} ON_ROUTE")
    @CsvSource({"4.0511,9.7679","4.9601,11.8616","5.9667,14.3167"})
    void tc143_corridorWpsOnRoute(double lat,double lon){ assertThat(svc.analyzePosition(lat,lon).status()).isEqualTo("ON_ROUTE"); }
}
