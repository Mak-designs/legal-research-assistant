
import React from "react";

const ContactSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Contact Us
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg/relaxed">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Email us at:</p>
            <p className="text-primary">
              <a href="mailto:makumbachinyimba@gmail.com">makumbachinyimba@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
