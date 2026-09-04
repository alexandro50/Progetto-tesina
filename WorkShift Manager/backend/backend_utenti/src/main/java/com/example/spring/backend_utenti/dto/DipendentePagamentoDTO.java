package com.example.spring.backend_utenti.dto;

public class DipendentePagamentoDTO {
    private Long id;
    private String nome;
    private String cognome;
    private String email;
    private String ruolo;
    private Double tariffaOraria;
    private Double oreTotali;

    public DipendentePagamentoDTO() {
    }

    public DipendentePagamentoDTO(Long id, String nome, String cognome, String email,
                                  String ruolo, Double tariffaOraria, Double oreTotali) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.ruolo = ruolo;
        this.tariffaOraria = tariffaOraria;
        this.oreTotali = oreTotali;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRuolo() { return ruolo; }
    public void setRuolo(String ruolo) { this.ruolo = ruolo; }
    public Double getTariffaOraria() { return tariffaOraria; }
    public void setTariffaOraria(Double tariffaOraria) { this.tariffaOraria = tariffaOraria; }
    public Double getOreTotali() { return oreTotali; }
    public void setOreTotali(Double oreTotali) { this.oreTotali = oreTotali; }
}
