package bendec.unions;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;


/**
 * <h2>Header</h2>

 * <p>Byte length: 1</p>
 * <p>AnimalKind2 animalKind - undefined | size 1</p>
 * */

public class Header implements ByteSerializable, JsonSerializable {

    private AnimalKind2 animalKind;
    public static final int byteLength = 1;

    public Header(AnimalKind2 animalKind) {
        this.animalKind = animalKind;
    }

    public Header(byte[] bytes, int offset) {
        this.animalKind = AnimalKind2.getAnimalKind2(bytes, offset);
    }

    public Header(byte[] bytes) {
        this(bytes, 0);
    }

    public Header() {
    }



    public AnimalKind2 getAnimalKind() {
        return this.animalKind;
    };

    public void setAnimalKind(AnimalKind2 animalKind) {
        this.animalKind = animalKind;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        animalKind.toBytes(buffer);
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        animalKind.toBytes(buffer);
    }

    @Override  
    public ObjectNode toJson() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode object = mapper.createObjectNode();
        object.set("animalKind", animalKind.toJson());
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("animalKind", animalKind.toJson());
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(animalKind);
    }

    @Override
    public String toString() {
        return "Header{" +
            "animalKind=" + animalKind +
            '}';
        }
}
