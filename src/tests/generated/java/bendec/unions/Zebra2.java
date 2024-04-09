package bendec.unions;

import java.math.BigInteger;
import java.util.*;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * <h2>Zebra2</h2>
 
 * <p>Byte length: 2</p>
 * <p>Header header | size 1</p>
 * <p>u8 > int legs | size 1</p>
 */
public class Zebra2 implements ByteSerializable, JsonSerializable, Animal2 {
    private Header header;
    private int legs;
    public static final int byteLength = 2;
    
    public Zebra2(Header header, int legs) {
        this.header = header;
        this.legs = legs;
    }
    
    public Zebra2(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.legs = BendecUtils.uInt8FromByteArray(bytes, offset + 1);
    }
    
    public Zebra2(byte[] bytes) {
        this(bytes, 0);
    }
    
    public Zebra2() {
    }
    
    public Header getHeader() {
        return this.header;
    }
    
    public int getLegs() {
        return this.legs;
    }
    
    public void setHeader(Header header) {
        this.header = header;
    }
    
    public void setLegs(int legs) {
        this.legs = legs;
    }
    
    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.legs));
        return buffer.array();
    }
    
    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.legs));
    }
    
    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("header", header.toJson());
        object.put("legs", legs);
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        object.put("legs", legs);
        return object;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(header,
        legs);
    }
    
    @Override
    public String toString() {
        return "Zebra2 {" +
            "header=" + header +
            ", legs=" + legs +
            "}";
    }
}