package me.omartanner.modulepal.rest.tabulaapi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.rest.tabulaapi.objects.Member;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MultipleMembersResponse extends Response {
    private Map<String, Member> members;
}
