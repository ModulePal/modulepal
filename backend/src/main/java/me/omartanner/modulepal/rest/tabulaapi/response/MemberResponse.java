package me.omartanner.modulepal.rest.tabulaapi.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.rest.tabulaapi.objects.Member;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponse extends Response {
    private Member member;
}
