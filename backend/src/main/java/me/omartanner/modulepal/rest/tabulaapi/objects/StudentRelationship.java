package me.omartanner.modulepal.rest.tabulaapi.objects;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentRelationship {
    private LocalDate startDate;
    private LocalDate endDate;
    private Double percentage;
    private Member agent;

    public StudentRelationship(LocalDate startDate, LocalDate endDate, Double percentage, Member agent) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.percentage = percentage;
        this.agent = agent;
    }
}
