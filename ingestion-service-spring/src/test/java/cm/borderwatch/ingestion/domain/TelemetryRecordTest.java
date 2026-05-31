package cm.borderwatch.ingestion.domain;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import java.time.Instant;
import static org.assertj.core.api.Assertions.*;

@DisplayName("TelemetryRecord Unit Tests")
class TelemetryRecordTest {
    static final String T="CE-TEST"; static final double LAT=4.96,LON=11.86;
    @Test void tc001_validRecord()      { var r=TelemetryRecord.of(T,LAT,LON,null,null,null); assertThat(r.id()).isNotNull(); assertThat(r.status()).isEqualTo("ON_ROUTE"); }
    @Test void tc002_lat91throws()      { assertThatThrownBy(()->TelemetryRecord.of(T,91,LON,null,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc003_lat_91throws()     { assertThatThrownBy(()->TelemetryRecord.of(T,-91,LON,null,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc004_lat90valid()       { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,90,LON,null,null,null)); }
    @Test void tc005_lon181throws()     { assertThatThrownBy(()->TelemetryRecord.of(T,LAT,181,null,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc006_lon180valid()      { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,180,null,null,null)); }
    @Test void tc007_nullTruckIdThrows(){ assertThatThrownBy(()->TelemetryRecord.of(null,LAT,LON,null,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc008_blankTruckIdThrows(){ assertThatThrownBy(()->TelemetryRecord.of("   ",LAT,LON,null,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc009_truckId21throws()  { assertThatThrownBy(()->TelemetryRecord.of("A".repeat(21),LAT,LON,null,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc010_truckId20valid()   { assertThatNoException().isThrownBy(()->TelemetryRecord.of("A".repeat(20),LAT,LON,null,null,null)); }
    @Test void tc011_speedNullOptional(){ assertThat(TelemetryRecord.of(T,LAT,LON,null,null,null).speedKmh()).isNull(); }
    @Test void tc012_speed0valid()      { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,LON,0.0,null,null)); }
    @Test void tc013_speed300valid()    { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,LON,300.0,null,null)); }
    @Test void tc014_speed301throws()   { assertThatThrownBy(()->TelemetryRecord.of(T,LAT,LON,301.0,null,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc015_heading0valid()    { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,LON,null,0.0,null)); }
    @Test void tc016_heading360valid()  { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,LON,null,360.0,null)); }
    @Test void tc017_heading361throws() { assertThatThrownBy(()->TelemetryRecord.of(T,LAT,LON,null,361.0,null)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc018_twoRecordsDiffIds(){ assertThat(TelemetryRecord.of(T,LAT,LON,null,null,null).id()).isNotEqualTo(TelemetryRecord.of(T,LAT,LON,null,null,null).id()); }
    @Test void tc019_uuidFormat()       { assertThat(TelemetryRecord.of(T,LAT,LON,null,null,null).id().toString()).matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"); }
    @Test void tc020_defaultStatusOnRoute(){ assertThat(TelemetryRecord.of(T,LAT,LON,null,null,null).status()).isEqualTo("ON_ROUTE"); }
    @Test void tc021_truckIdTrimmed()   { assertThat(TelemetryRecord.of("  CE-001  ",LAT,LON,null,null,null).truckId()).isEqualTo("CE-001"); }
    @Test void tc022_timestampDefaults(){ var b=Instant.now().minusSeconds(1); assertThat(TelemetryRecord.of(T,LAT,LON,null,null,null).timestamp()).isAfter(b); }
    @Test void tc023_customTimestamp()  { var ts=Instant.parse("2026-04-15T10:30:00Z"); assertThat(TelemetryRecord.of(T,LAT,LON,null,null,ts).timestamp()).isEqualTo(ts); }
    @Test void tc024_doualaCoords()     { assertThatNoException().isThrownBy(()->TelemetryRecord.of("DOUALA-001",4.0511,9.7679,72.5,45.0,null)); }
    @ParameterizedTest @ValueSource(doubles={-90,0,45,90})
    void tc025_validLats(double lat)    { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,lat,LON,null,null,null)); }
    @ParameterizedTest @ValueSource(doubles={-180,0,90,180})
    void tc026_validLons(double lon)    { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,lon,null,null,null)); }
    @Test void tc027_fullRecord()       { var r=TelemetryRecord.of("CE-FULL",4.96,11.86,72.5,45.0,Instant.now()); assertThat(r.speedKmh()).isEqualTo(72.5); assertThat(r.heading()).isEqualTo(45.0); }
    @Test void tc028_lat_90valid()      { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,-90,LON,null,null,null)); }
    @Test void tc029_lon_180valid()     { assertThatNoException().isThrownBy(()->TelemetryRecord.of(T,LAT,-180,null,null,null)); }
}
